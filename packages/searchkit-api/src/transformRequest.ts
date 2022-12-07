import { QueryRuleActions } from './queryRules'
import { FacetAttribute, RequestOptions, SearchSettingsConfig } from './types'
import {
  AlgoliaMultipleQueriesQuery,
  ElasticsearchQuery,
  ElasticsearchSearchRequest
} from './types'
import { getFacetByAttribute, getFacetField, getFacetFieldType } from './utils'

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
    const [match, field, operator, value] = filter.match(/(\w+)(\=|\!\=|\>|\>\=|\<|\<\=)(\d+)/)

    if (!match) return sum

    const esFilter = []

    if (operator === '=') {
      esFilter.push({
        term: {
          [field]: value
        }
      })
    } else if (operator === '!=') {
      esFilter.push({
        bool: {
          must_not: {
            term: {
              [field]: value
            }
          }
        }
      })
    } else if (operator === '>') {
      esFilter.push({
        range: {
          [field]: {
            gt: value
          }
        }
      })
    } else if (operator === '>=') {
      esFilter.push({
        range: {
          [field]: {
            gte: value
          }
        }
      })
    } else if (operator === '<') {
      esFilter.push({
        range: {
          [field]: {
            lt: value
          }
        }
      })
    } else if (operator === '<=') {
      esFilter.push({
        range: {
          [field]: {
            lte: value
          }
        }
      })
    }

    return [...sum, ...esFilter]
  }, [])
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
              const field = getFacetField(config.facet_attributes || [], facet)

              return [...sum, { term: { [field]: value } }]
            }, [])
          }
        }
      ]
    } else if (typeof filter === 'string') {
      const [facet, value] = filter.split(':')
      const field = getFacetField(config.facet_attributes || [], facet)

      return [...sum, { term: { [field]: value } }]
    }
  }, [])
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

  if (facetName) {
    return {
      [facetName]: {
        terms: {
          field: getFacetField(config.facet_attributes || [], facetName),
          size: maxFacetSize,
          include: createRegexQuery(facetQuery)
        }
      }
    }
  } else if (Array.isArray(facets)) {
    let facetAttibutes = config.facet_attributes || []
    if (queryRuleActions.facetAttributesOrder) {
      facetAttibutes = queryRuleActions.facetAttributesOrder.map((attribute) => {
        return getFacetByAttribute(config.facet_attributes || [], attribute)
      })
    }

    const facetAttributes: FacetAttribute[] = facets[0] === '*' ? facetAttibutes : facets
    return (
      facetAttributes.reduce((sum, facet) => {
        const fieldType = getFacetFieldType(config.facet_attributes || [], facet)
        const field = getFacetField(config.facet_attributes || [], facet)
        const attributeName = getFacetByAttribute(config.facet_attributes || [], facet)

        if (fieldType === 'numeric') {
          return {
            ...sum,
            [attributeName + '$_stats']: {
              stats: {
                field
              }
            },
            [attributeName + '$_entries']: {
              terms: {
                field,
                size: maxFacetSize
              }
            }
          }
        }

        return {
          ...sum,
          [attributeName]: {
            terms: {
              field: field,
              size: maxFacetSize
            }
          }
        }
      }, {}) || {}
    )
  } else if (typeof facets === 'string') {
    const fieldType = getFacetFieldType(config.facet_attributes || [], facets)
    const field = getFacetField(config.facet_attributes || [], facets)
    const attributeName = getFacetByAttribute(config.facet_attributes || [], facets)

    if (fieldType === 'numeric') {
      return {
        [attributeName + '$_stats']: {
          stats: {
            field
          }
        },
        [attributeName + '$_entries']: {
          terms: {
            field,
            size: maxFacetSize
          }
        }
      }
    }

    return {
      [attributeName]: {
        terms: {
          field: field,
          size: maxFacetSize
        }
      }
    }
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
