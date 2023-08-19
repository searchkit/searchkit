import { QueryDslQueryContainer, RankContainer, RrfRank } from '@elastic/elasticsearch/lib/api/types'
import deepmerge from 'deepmerge'
import {
  transformBaseFilters,
  transformFacetFilters,
  transformGeoFilters,
  transformNumericFilters
} from './filters'
import { QueryRuleActions } from './queryRules'
import { getSorting } from './sorting'
import {
  FacetAttribute,
  KnnSearchQuery,
  RequestOptions,
  SearchAttribute,
  SearchSettingsConfig
} from './types'
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
    if (!field) return {}
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
): { query?: QueryDslQueryContainer; knn?: KnnSearchQuery, rank?: RankContainer } => {
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

  let organicQuery =
    typeof query === 'string' && query !== ''
      ? requestOptions?.getQuery
        ? requestOptions.getQuery(query, searchAttributes, config)
        : RelevanceQueryMatch(query, searchAttributes)
      : {
          match_all: {}
        }

  const hasKnn = typeof requestOptions?.getKnnQuery === 'function'
  const hasNoQuery = requestOptions?.getQuery?.(query, searchAttributes, config) === false

  if (hasNoQuery || (hasKnn && query === '')) {
    organicQuery = {
      match_all: {}
    }
  }

  const queryDsl = {
    bool: {
      filter: filters,
      must: queryRuleActions.touched
        ? queryRulesWrapper(organicQuery, queryRuleActions)
        : organicQuery
    }
  }

  let knnQueryDsl: KnnSearchQuery | null = null

  if (hasKnn && query !== '') {
    knnQueryDsl = {
      filter: filters,
      ...(requestOptions?.getKnnQuery?.(query, searchAttributes, config) || {})
    } as KnnSearchQuery
  }

  if (query !== '' && hasNoQuery && hasKnn && knnQueryDsl) {
    return {
      knn: knnQueryDsl
    }
  }
  
  const size = getHitsPerPage(request)

  return {
    query: queryDsl,
    knn: knnQueryDsl ? knnQueryDsl : undefined,
    // in hybrid mode (knn + keyword query), is displaying results and query is not empty
    rank: hasKnn && !hasNoQuery && size > 0 && query !== '' ? { rrf: { window_size: size } } : undefined
  }
}

const getHitsPerPage = (request: AlgoliaMultipleQueriesQuery) => {
  const { params = {} } = request
  return params.hitsPerPage == null ? 20 : params.hitsPerPage
}

const getResultsSize = (request: AlgoliaMultipleQueriesQuery, config: SearchSettingsConfig) => {
  const { params = {} } = request
  const hitsPerPage = getHitsPerPage(request)

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

export const getSnippetFieldLength = (attribute: string) => {
  const defaultMatch = {
    attribute,
    length: 100
  }
  if (!attribute.includes(':')) {
    return defaultMatch
  }
  const match = attribute.match(/(.+)\:(\d+)/)
  if (!match) return defaultMatch
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

  if (Object.keys(highlightFields).length === 0 && Object.keys(snippetFields).length === 0) {
    return {}
  }

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
    ...getQuery(request, config, queryRuleActions, requestOptions),
    ...getResultsSize(request, config),
    ...getHitFields(request, config),
    ...getHighlightFields(request, config),
    ...getSorting(request, config)
  }

  return body
}
