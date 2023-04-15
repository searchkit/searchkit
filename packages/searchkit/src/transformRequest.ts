import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types'
import deepmerge from 'deepmerge'
import {
  transformBaseFilters,
  transformFacetFilters,
  transformGeoFilters,
  transformNumericFilters
} from './filters'
import { QueryRuleActions } from './queryRules'
import { getSorting } from './sorting'
import { FacetAttribute, RequestOptions, SearchAttribute, SearchSettingsConfig } from './types'
import { AlgoliaMultipleQueriesQuery, ElasticsearchSearchRequest } from './types'
import { getFacet, isNestedFacet } from './utils'

export const createRegexQuery = (queryString: string) => {
  let query = queryString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  query = query
    .split('')
    .map((char) => {
      if (/[a-z]/.test(char)) {
        return `[${char}${char.toUpperCase()}]`
      }
      return char
    })
    .join('')
  query = `${query}.*`
  if (queryString.length > 2) {
    query = `([a-zA-Z]+ )+?${query}`
  }
  return query
}

const TermAggregation = (field: string, size: number, search: string) => {
  const searchInclude = search && search.length > 0 ? { include: createRegexQuery(search) } : {}
  return {
    terms: {
      field,
      size,
      ...searchInclude
    }
  }
}

const getTermAggregation = (facet: FacetAttribute, size: number, search: string) => {
  let aggEntries = {}
  const AggregationFn =
    typeof facet !== 'string' && facet.facetQuery ? facet.facetQuery : TermAggregation

  const getInnerAggs = (facetName: string, field: string): any => {
    if (typeof facet === 'string' || facet.type === 'string') {
      aggEntries = {
        [facetName]: AggregationFn(field, size, search)
      }
    } else if (facet.type === 'numeric') {
      aggEntries = {
        [facetName + '$_stats']: {
          stats: {
            field: field
          }
        },
        [facetName + '$_entries']: AggregationFn(field, size, search)
      }
    }
    return aggEntries
  }

  if (typeof facet === 'string') {
    return getInnerAggs(facet, facet)
  } else if (isNestedFacet(facet)) {
    return {
      [`${facet.nestedPath}.`]: {
        nested: {
          path: facet.nestedPath
        },
        aggs: getInnerAggs(facet.attribute, `${facet.nestedPath}.${facet.field}`)
      }
    }
  } else {
    return getInnerAggs(facet.attribute, facet.field)
  }
}

export const getAggs = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig,
  queryRuleActions: QueryRuleActions
) => {
  const { params = {}, type } = request
  // @ts-ignore
  const { facets, maxValuesPerFacet, facetName, facetQuery } = params
  const maxFacetSize = maxValuesPerFacet || 10
  const facetAttributes = config.facet_attributes || []

  if (facetName) {
    const facet = getFacet(facetAttributes, facetName)
    if (!facet) return null
    return getTermAggregation(facet, maxFacetSize, facetQuery)
  } else if (Array.isArray(facets)) {
    let facetAttibutes = config.facet_attributes || []

    if (queryRuleActions.facetAttributesOrder) {
      facetAttibutes = queryRuleActions.facetAttributesOrder
        .map((attribute) => {
          return getFacet(config.facet_attributes || [], attribute)
        })
        .filter((x): x is FacetAttribute => x !== null)
    }

    const facetAttributes: FacetAttribute[] =
      facets[0] === '*'
        ? facetAttibutes
        : facets
            .map((facetAttribute) => {
              return getFacet(config.facet_attributes || [], facetAttribute)
            })
            .filter((x): x is FacetAttribute => x !== null)

    return (
      facetAttributes.reduce((sum, facet) => {
        return deepmerge(sum, getTermAggregation(facet, maxFacetSize, ''))
      }, {}) || {}
    )
  } else if (typeof facets === 'string') {
    const field = getFacet(config.facet_attributes || [], facets)
    if (!field) return null
    return getTermAggregation(field, maxFacetSize, '')
  }
}

function queryRulesWrapper(organicQuery: any, queryRuleActions: QueryRuleActions) {
  if (queryRuleActions.touched) {
    return {
      function_score: {
        query: {
          pinned: {
            ids: queryRuleActions.pinnedDocs,
            organic: organicQuery
          }
        },
        functions: queryRuleActions.boostFunctions
      }
    }
  }
  return organicQuery
}

export function RelevanceQueryMatch(query: string, search_attributes: SearchAttribute[]) {
  const getFieldsMap = (boostMultiplier: number) => {
    return search_attributes.map((attribute) => {
      return typeof attribute === 'string'
        ? attribute
        : `${attribute.field}^${(attribute.weight || 1) * boostMultiplier}`
    })
  }

  return {
    bool: {
      should: [
        {
          bool: {
            should: [
              {
                multi_match: {
                  query: query,
                  fields: getFieldsMap(1),
                  fuzziness: 'AUTO:4,8'
                }
              },
              {
                multi_match: {
                  query: query,
                  fields: getFieldsMap(0.5),
                  type: 'bool_prefix'
                }
              }
            ]
          }
        },
        {
          multi_match: {
            query: query,
            type: 'phrase',
            fields: getFieldsMap(2)
          }
        }
      ]
    }
  }
}

const getQuery = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig,
  queryRuleActions: QueryRuleActions,
  requestOptions?: RequestOptions
): QueryDslQueryContainer => {
  const query = queryRuleActions.query

  const searchAttributes = config.search_attributes

  const filters = [
    ...transformFacetFilters(request, config),
    ...transformNumericFilters(request, config),
    ...transformBaseFilters(request, config),
    ...transformGeoFilters(request, config),
    ...(requestOptions?.getBaseFilters?.() || []),
    ...queryRuleActions.baseFilters
  ]

  const organicQuery =
    typeof query === 'string' && query !== ''
      ? requestOptions?.getQuery
        ? requestOptions.getQuery(query, searchAttributes, config)
        : RelevanceQueryMatch(query, searchAttributes)
      : {
          match_all: {}
        }

  return {
    bool: {
      filter: filters,
      must: queryRuleActions.touched
        ? queryRulesWrapper(organicQuery, queryRuleActions)
        : organicQuery
    }
  }
}

const getResultsSize = (request: AlgoliaMultipleQueriesQuery, config: SearchSettingsConfig) => {
  const { params = {} } = request
  const hitsPerPage = params.hitsPerPage == null ? 20 : params.hitsPerPage

  return {
    size: hitsPerPage,
    from: (params.page || 0) * hitsPerPage
  }
}

export const getHitFields = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
) => {
  const { params = {} } = request
  const { attributesToRetrieve } = params
  // ignoring attributesToRetrieve for now

  const sourceFields = new Set([
    ...(config.result_attributes || []),
    ...(config.highlight_attributes || []),
    ...(config.geo_attribute ? [config.geo_attribute] : [])
  ])

  return {
    _source: {
      includes: Array.from(sourceFields)
    }
  }
}

const getSnippetFieldLength = (attribute: string) => {
  const match = attribute.match(/(.+)\:(\d+)/)
  if (!match)
    return {
      attribute,
      length: 100
    }
  return {
    attribute: match[1],
    length: parseInt(match[2])
  }
}

export const getHighlightFields = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
) => {
  const { params = {} } = request
  const { attributesToHighlight } = params
  // ignoring attributesToHighlight for now

  const highlightFields =
    config.highlight_attributes?.reduce(
      (sum, field) => ({
        ...sum,
        [field]: {
          number_of_fragments: 0
        }
      }),
      {}
    ) || {}

  const snippetFields =
    config.snippet_attributes?.reduce(
      (sum, attribute) => ({
        ...sum,
        [getSnippetFieldLength(attribute).attribute]: {
          number_of_fragments: 5,
          fragment_size: getSnippetFieldLength(attribute).length
        }
      }),
      {}
    ) || {}

  return {
    highlight: {
      pre_tags: ['<em>'],
      post_tags: ['</em>'],
      fields: {
        ...highlightFields,
        ...snippetFields
      }
    }
  }
}

export function transformRequest(
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig,
  queryRuleActions: QueryRuleActions,
  requestOptions?: RequestOptions
): ElasticsearchSearchRequest {
  const body: ElasticsearchSearchRequest = {
    aggs: getAggs(request, config, queryRuleActions),
    query: getQuery(request, config, queryRuleActions, requestOptions),
    ...getResultsSize(request, config),
    ...getHitFields(request, config),
    ...getHighlightFields(request, config),
    ...getSorting(request, config)
  }

  return body
}
