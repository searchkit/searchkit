import { TermFilter } from './filterUtils'
import {
  getFacetFilterMap,
  getFacetFiltersAst,
  getGeoFiltersAst,
  getNumericFiltersAst,
  isNestedFacet,
  transformQueryString
} from '@searchkit/core'
import type {
  AlgoliaMultipleQueriesQuery,
  ElasticsearchQuery,
  FacetFieldConfig,
  FilterAttribute,
  FilterNode,
  SearchSettingsConfig
} from '@searchkit/core'

type FilterConfig = FacetFieldConfig | FilterAttribute
type FilterConfigMap = Record<string, FilterConfig>

const RANGE_KEYS = ['gte', 'gt', 'lte', 'lt'] as const

/**
 * Compiles a filter AST node to an Elasticsearch query. `getField` resolves a node's attribute to
 * the Elasticsearch field. Values written in the request (`raw`) are passed through as written.
 */
export const compileFilterNode = (
  node: FilterNode,
  getField: (attribute: string) => string
): ElasticsearchQuery => {
  switch (node.op) {
    case 'and':
      return { bool: { filter: node.nodes.map((n) => compileFilterNode(n, getField)) } }
    case 'or':
      return { bool: { should: node.nodes.map((n) => compileFilterNode(n, getField)) } }
    case 'not':
      return { bool: { must_not: compileFilterNode(node.node, getField) } }
    case 'eq':
      return { term: { [getField(node.attribute)]: node.raw ?? (node.value as any) } }
    case 'in':
      return { terms: { [getField(node.attribute)]: node.values } }
    case 'range': {
      const bounds: Record<string, string | number> = {}
      for (const key of RANGE_KEYS) {
        const value = node.raw?.[key] ?? node[key]
        if (value !== undefined) bounds[key] = value
      }
      return { range: { [getField(node.attribute)]: bounds } }
    }
    case 'geo_distance':
      return {
        geo_distance: {
          distance: (node.radius || '1000m') as any,
          [getField(node.attribute)]: {
            lat: (node.raw ? node.raw.lat : node.lat) as any,
            lon: (node.raw ? node.raw.lng : node.lng) as any
          }
        }
      }
    case 'geo_bbox': {
      const [top, left, bottom, right] = node.box
      return {
        geo_bounding_box: {
          [getField(node.attribute)]: {
            top_right: {
              lat: top,
              lon: left
            },
            bottom_left: {
              lat: bottom,
              lon: right
            }
          }
        }
      }
    }
    case 'exists':
      return { exists: { field: getField(node.attribute) } }
  }
}

const getConfigMap = (config: SearchSettingsConfig): FilterConfigMap =>
  getFacetFilterMap(config.facet_attributes || [], config.filter_attributes || [])

const leafAttribute = (node: FilterNode): string => {
  if (node.op === 'not') return leafAttribute(node.node)
  if ('attribute' in node) return node.attribute
  throw new Error(`Unexpected "${node.op}" filter`)
}

/**
 * Compiles the `facetFilters` AST (see `getFacetFiltersAst`) into Elasticsearch filter clauses:
 * `term` queries (or the attribute's custom `filterQuery`), a `bool.should` per disjunctive facet,
 * and `nested` queries for nested attributes.
 */
export const compileFacetFilters = (
  nodes: FilterNode[],
  facetFilterMap: FilterConfigMap
): ElasticsearchQuery[] => {
  const resolve = (facet: string) => {
    const facetFilterConfig = facetFilterMap[facet]
    if (!facetFilterConfig)
      throw new Error(
        `Facet "${facet}" not found in configuration. Add configuration to either facet_attributes or filter_attributes.`
      )
    const filterClauseFn =
      'filterQuery' in facetFilterConfig && facetFilterConfig.filterQuery
        ? facetFilterConfig.filterQuery
        : TermFilter
    return { facetFilterConfig, filterClauseFn }
  }

  return nodes.reduce<any[]>((sum, node) => {
    if (node.op === 'or') {
      return [
        ...sum,
        {
          bool: {
            should: node.nodes.reduce<any[]>((sum, eq) => {
              if (eq.op !== 'eq') throw new Error(`Unexpected "${eq.op}" facet filter`)
              const value = eq.value as string
              const { facetFilterConfig, filterClauseFn } = resolve(eq.attribute)
              const field = facetFilterConfig.field

              if (isNestedFacet(facetFilterConfig)) {
                // detect if there is a nested filter in sum
                // if one doesn't exist, add one
                // if one does exist, add to it
                const nestedFilter = sum.find((filter: any) => {
                  return filter.nested && filter.nested.path === facetFilterConfig.nestedPath
                })

                if (nestedFilter) {
                  nestedFilter.nested.query.bool.should.push(
                    filterClauseFn(
                      `${facetFilterConfig.nestedPath}.${facetFilterConfig.field}`,
                      value
                    )
                  )
                  return sum
                } else {
                  return [
                    ...sum,
                    {
                      nested: {
                        inner_hits: {},
                        path: facetFilterConfig.nestedPath,
                        query: {
                          bool: {
                            should: [
                              filterClauseFn(
                                `${facetFilterConfig.nestedPath}.${facetFilterConfig.field}`,
                                value
                              )
                            ]
                          }
                        }
                      }
                    }
                  ]
                }
              }
              return [...sum, filterClauseFn(field, value)]
            }, [])
          }
        }
      ]
    } else if (node.op === 'eq') {
      const value = node.value as string
      const { facetFilterConfig, filterClauseFn } = resolve(node.attribute)

      if (isNestedFacet(facetFilterConfig) && facetFilterConfig.nestedPath) {
        // detect if there is a nested filter in sum
        // if one doesn't exist, add one
        // if one does exist, add to it
        const nestedFilter = sum.find((filter: any) => {
          return filter.nested && filter.nested.path === facetFilterConfig.nestedPath + '.'
        })

        if (nestedFilter) {
          nestedFilter.nested.query.bool.should.push(
            filterClauseFn(`${facetFilterConfig.nestedPath}.${facetFilterConfig.field}`, value)
          )
          return sum
        } else {
          return [
            ...sum,
            {
              nested: {
                inner_hits: {},
                path: facetFilterConfig.nestedPath,
                query: {
                  bool: {
                    should: [
                      filterClauseFn(
                        `${facetFilterConfig.nestedPath}.${facetFilterConfig.field}`,
                        value
                      )
                    ]
                  }
                }
              }
            }
          ]
        }
      }
      return [...sum, filterClauseFn(facetFilterConfig.field, value)]
    }
    throw new Error(`Unexpected "${node.op}" facet filter`)
  }, [])
}

/**
 * Compiles the `numericFilters` AST (see `getNumericFiltersAst`) into Elasticsearch filter
 * clauses: `term`, `bool.must_not` and `range` queries, grouped in one `nested` query per nested path.
 */
export const compileNumericFilters = (
  nodes: FilterNode[],
  facetFilterMap: FilterConfigMap
): ElasticsearchQuery[] => {
  return nodes.reduce<any[]>((sum, node) => {
    const attribute = leafAttribute(node)
    const facetFilterConfig = facetFilterMap[attribute]
    if (!facetFilterConfig) {
      throw new Error(
        `Numeric filter attribute "${attribute}" not found in configuration. Add configuration to either facet_attributes or filter_attributes.`
      )
    }

    const getFilter = (field: string) => compileFilterNode(node, () => field)

    const esFilter = []

    if (facetFilterConfig.nestedPath) {
      const nestedPathPresent = sum.find((filter: any) => {
        return filter.nested && filter.nested.path === facetFilterConfig.nestedPath
      })

      if (nestedPathPresent) {
        nestedPathPresent.nested.query.bool.filter.push(
          getFilter(facetFilterConfig.nestedPath + '.' + facetFilterConfig.field)
        )
      } else {
        esFilter.push({
          nested: {
            path: facetFilterConfig.nestedPath,
            inner_hits: {},
            query: {
              bool: {
                filter: [getFilter(facetFilterConfig.nestedPath + '.' + facetFilterConfig.field)]
              }
            }
          }
        })
      }
    } else {
      esFilter.push(getFilter(facetFilterConfig.field))
    }

    return [...sum, ...esFilter]
  }, [])
}

export const transformNumericFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): ElasticsearchQuery[] =>
  compileNumericFilters(getNumericFiltersAst(request), getConfigMap(config))

export const transformFacetFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): ElasticsearchQuery[] => compileFacetFilters(getFacetFiltersAst(request), getConfigMap(config))

/**
 * A `filters` / query rule string as an Elasticsearch `query_string` query, with attributes mapped
 * to their fields. Elasticsearch evaluates the full Lucene query string syntax, so the string is
 * passed through rather than compiled from the (narrower) filter AST.
 */
export const queryStringFilter = (config: SearchSettingsConfig, query: string) => ({
  query_string: {
    query: transformQueryString(config.facet_attributes, config.filter_attributes, query)
  }
})

export const transformBaseFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
) => {
  const { params = {} } = request
  const { filters } = params

  if (!filters || filters === '') {
    return []
  }

  return [queryStringFilter(config, filters)]
}

export const transformGeoFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): ElasticsearchQuery[] =>
  getGeoFiltersAst(request, config).map((node) => compileFilterNode(node, (attribute) => attribute))
