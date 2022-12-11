import deepmerge from 'deepmerge'
import { QueryRuleActions } from './queryRules'
import { FacetAttribute, RequestOptions, SearchSettingsConfig } from './types'
import {
  AlgoliaMultipleQueriesQuery,
  ElasticsearchQuery,
  ElasticsearchSearchRequest
} from './types'
import { getFacet, getFacetAttribute } from './utils'

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

const transformNumericFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): ElasticsearchQuery[] => {
  const { params = {} } = request
  const { numericFilters } = params

  if (!Array.isArray(numericFilters)) {
    return []
  }

  return numericFilters.reduce((sum, filter) => {
    const [match, field, operator, value] = filter.match(
      /([\w\.\_\-]+)(\=|\!\=|\>|\>\=|\<|\<\=)(\d+)/
    )
    const fieldConfig = getFacet(config.facet_attributes || [], field)

    if (!match) return sum

    const getFilter = (operator: string, value: string) => {
      if (operator === '=') {
        return {
          term: {
            [field]: value
          }
        }
      } else if (operator === '!=') {
        return {
          bool: {
            must_not: {
              term: {
                [field]: value
              }
            }
          }
        }
      } else if (operator === '>') {
        return {
          range: {
            [field]: {
              gt: value
            }
          }
        }
      } else if (operator === '>=') {
        return {
          range: {
            [field]: {
              gte: value
            }
          }
        }
      } else if (operator === '<') {
        return {
          range: {
            [field]: {
              lt: value
            }
          }
        }
      } else if (operator === '<=') {
        return {
          range: {
            [field]: {
              lte: value
            }
          }
        }
      }
    }

    const esFilter = []

    if (typeof fieldConfig !== 'string' && fieldConfig.nestedPath) {
      esFilter.push({
        nested: {
          path: fieldConfig.nestedPath,
          query: {
            bool: {
              filter: [getFilter(operator, value)]
            }
          }
        }
      })
    } else {
      esFilter.push(getFilter(operator, value))
    }

    return [...sum, ...esFilter]
  }, [])
}

const termFilter = (field: string, value: string) => {
  return { term: { [field]: value } }
}

const transformFacetFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): ElasticsearchQuery[] => {
  const { params = {} } = request
  const { facetFilters } = params

  if (!Array.isArray(facetFilters)) {
    return []
  }

  return facetFilters.reduce((sum, filter) => {
    if (Array.isArray(filter)) {
      return [
        ...sum,
        {
          bool: {
            should: filter.reduce((sum, filter) => {
              const [facet, value] = filter.split(':')
              const facetAttribute = getFacetAttribute(facet)
              const facetConfig = getFacet(config.facet_attributes || [], facetAttribute)
              const field = typeof facetConfig === 'string' ? facetConfig : facetConfig.field

              if (
                typeof facetConfig !== 'string' &&
                isNestedFacet(facetConfig) &&
                facetConfig.nestedPath
              ) {
                // detect if there is a nested filter in sum
                // if one doesn't exist, add one
                // if one does exist, add to it
                const nestedFilter = sum.find((filter: any) => {
                  return filter.nested && filter.nested.path === facetConfig.nestedPath
                })

                if (nestedFilter) {
                  nestedFilter.nested.query.bool.should.push(
                    termFilter(`${facetConfig.nestedPath}.${facetConfig.field}`, value)
                  )
                  return sum
                } else {
                  return [
                    ...sum,
                    {
                      nested: {
                        path: facetConfig.nestedPath,
                        query: {
                          bool: {
                            should: [
                              termFilter(`${facetConfig.nestedPath}.${facetConfig.field}`, value)
                            ]
                          }
                        }
                      }
                    }
                  ]
                }
              }
              return [...sum, termFilter(field, value)]
            }, [])
          }
        }
      ]
    } else if (typeof filter === 'string') {
      const [facet, value] = filter.split(':')
      const facetAttribute = getFacetAttribute(facet)
      const facetConfig = getFacet(config.facet_attributes || [], facetAttribute)
      const field = typeof facetConfig === 'string' ? facetConfig : facetConfig.field

      if (typeof facetConfig !== 'string' && isNestedFacet(facetConfig) && facetConfig.nestedPath) {
        // detect if there is a nested filter in sum
        // if one doesn't exist, add one
        // if one does exist, add to it
        const nestedFilter = sum.find((filter: any) => {
          return filter.nested && filter.nested.path === facetConfig.nestedPath + '.'
        })

        if (nestedFilter) {
          nestedFilter.nested.query.bool.should.push(
            termFilter(`${facetConfig.nestedPath}.${facetConfig.field}`, value)
          )
          return sum
        } else {
          return [
            ...sum,
            {
              nested: {
                path: facetConfig.nestedPath,
                query: {
                  bool: {
                    should: [termFilter(`${facetConfig.nestedPath}.${facetConfig.field}`, value)]
                  }
                }
              }
            }
          ]
        }
      }
      return [...sum, termFilter(field, value)]
    }
  }, [])
}

const isNestedFacet = (facet: FacetAttribute): boolean => {
  return typeof facet !== 'string' && !!facet.nestedPath
}

const getTermAggregation = (facet: FacetAttribute, size: number, search: string) => {
  const searchInclude = search && search.length > 0 ? { include: createRegexQuery(search) } : {}
  let aggEntries = {}

  const getInnerAggs = (facetName: string, field: string): any => {
    if (typeof facet === 'string' || facet.type === 'string') {
      aggEntries = {
        [facetName]: {
          terms: {
            field: field,
            size,
            ...searchInclude
          }
        }
      }
    } else if (facet.type === 'numeric') {
      aggEntries = {
        [facetName + '$_stats']: {
          stats: {
            field: field
          }
        },
        [facetName + '$_entries']: {
          terms: {
            field: field,
            size: size
          }
        }
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
    return getTermAggregation(getFacet(facetAttributes, facetName), maxFacetSize, facetQuery)
  } else if (Array.isArray(facets)) {
    let facetAttibutes = config.facet_attributes || []

    if (queryRuleActions.facetAttributesOrder) {
      facetAttibutes = queryRuleActions.facetAttributesOrder.map((attribute) => {
        return getFacet(config.facet_attributes || [], attribute)
      })
    }

    const facetAttributes: FacetAttribute[] =
      facets[0] === '*'
        ? facetAttibutes
        : facets.map((facetAttribute) => {
            return getFacet(config.facet_attributes || [], facetAttribute)
          })
    return (
      facetAttributes.reduce((sum, facet) => {
        return deepmerge(sum, getTermAggregation(facet, maxFacetSize, ''))
      }, {}) || {}
    )
  } else if (typeof facets === 'string') {
    const field = getFacet(config.facet_attributes || [], facets)
    return getTermAggregation(field, maxFacetSize, '')
  }
}

export function RelevanceQueryMatch(
  query: string,
  search_attributes: string[],
  queryRuleActions: QueryRuleActions
) {
  if (queryRuleActions) {
    return {
      function_score: {
        query: {
          pinned: {
            ids: queryRuleActions.pinnedDocs,
            organic: {
              combined_fields: {
                query: queryRuleActions.query,
                fields: search_attributes
              }
            }
          }
        },
        functions: queryRuleActions.boostFunctions
      }
    }
  }
  return {
    combined_fields: { query: query, fields: search_attributes }
  }
}

const getQuery = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig,
  queryRuleActions: QueryRuleActions,
  requestOptions?: RequestOptions
) => {
  const { params = {} } = request
  const { query } = params

  const searchAttributes = config.search_attributes

  const filters = [
    ...transformFacetFilters(request, config),
    ...transformNumericFilters(request, config),
    ...(requestOptions?.getBaseFilters?.() || [])
  ]

  return {
    bool: {
      filter: filters,
      must:
        typeof query === 'string' && query !== ''
          ? requestOptions?.getQuery
            ? requestOptions.getQuery(query, searchAttributes, config)
            : RelevanceQueryMatch(query, searchAttributes, queryRuleActions)
          : []
    }
  }
}

const getResultsSize = (request: AlgoliaMultipleQueriesQuery, config: SearchSettingsConfig) => {
  const { params = {} } = request
  const hitsPerPage = params.hitsPerPage || 20

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

  return {
    _source: {
      includes: config.result_attributes
    }
  }
}

export const getHighlightFields = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
) => {
  const { params = {} } = request
  const { attributesToHighlight } = params
  // ignoring attributesToHighlight for now
  return {
    highlight: {
      pre_tags: [params.highlightPreTag || '<ais-highlight-0000000000>'],
      post_tags: [params.highlightPostTag || '</ais-highlight-0000000000>'],
      fields:
        config.highlight_attributes?.reduce(
          (sum, field) => ({
            ...sum,
            [field]: {}
          }),
          {}
        ) || {}
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
    ...getHighlightFields(request, config)
  }

  return body
}
