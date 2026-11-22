import {
  QueryDslQueryContainer,
  RankContainer,
  RrfRank
} from '@elastic/elasticsearch/lib/api/types'
import {
  queryStringFilter,
  transformBaseFilters,
  transformFacetFilters,
  transformGeoFilters,
  transformNumericFilters
} from './filters'
import { getSorting } from './sorting'
import { getKnnQueryBuilder } from './semantic'
import type {
  AlgoliaMultipleQueriesQuery,
  ElasticsearchSearchRequest,
  FacetAttribute,
  FacetValueOrder,
  KnnSearchQuery,
  QueryConfig,
  QueryRuleActions,
  RequestOptions,
  SearchAttribute,
  SearchSettingsConfig
} from '@searchkit/core'
import {
  getFacet,
  getHitsPerPage,
  getResultsSize,
  getSnippetFieldLength,
  isNestedFacet
} from '@searchkit/core'
import { createRegexQuery, deepMerge } from './utils'

export { getSnippetFieldLength }

const TermAggregation = (field: string, size: number, search: string, order?: FacetValueOrder) => {
  const searchInclude = search && search.length > 0 ? { include: createRegexQuery(search) } : {}
  const bucketOrder = order === 'alpha' ? { order: { _key: 'asc' as const } } : {}
  return {
    terms: {
      field,
      size,
      ...bucketOrder,
      ...searchInclude
    }
  }
}

const getTermAggregation = (facet: FacetAttribute, size: number, search: string) => {
  let aggEntries = {}
  const order = typeof facet !== 'string' && 'order' in facet ? facet.order : undefined
  const AggregationFn =
    typeof facet !== 'string' && 'facetQuery' in facet
      ? facet.facetQuery
      : (field: string, aggSize: number, aggSearch: string) =>
          TermAggregation(field, aggSize, aggSearch, order)

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
  const { facets, maxValuesPerFacet, facetName, facetQuery = '' } = params
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
        return deepMerge(sum, getTermAggregation(facet, maxFacetSize, ''))
      }, {}) || {}
    )
  } else if (typeof facets === 'string') {
    const field = getFacet(config.facet_attributes || [], facets)
    if (!field) return {}
    return getTermAggregation(field, maxFacetSize, '')
  }
}

function queryRulesWrapper(
  organicQuery: any,
  queryRuleActions: QueryRuleActions,
  config: SearchSettingsConfig
) {
  if (queryRuleActions.touched) {
    return {
      function_score: {
        query: {
          pinned: {
            ids: queryRuleActions.pinnedDocs,
            organic: organicQuery
          }
        },
        functions: queryRuleActions.boosts.map((boost) => ({
          filter: queryStringFilter(config, boost.query),
          weight: boost.weight
        }))
      }
    }
  }
  return organicQuery
}

export function RelevanceQueryMatch(
  query: string,
  search_attributes: SearchAttribute[],
  fuzziness: string = 'AUTO:4,8'
) {
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
                  fuzziness: fuzziness
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
  requestOptions?: RequestOptions,
  queryVector?: number[]
): { query?: QueryDslQueryContainer; knn?: KnnSearchQuery; rank?: RankContainer } => {
  const query = queryRuleActions.query

  const searchAttributes = config.search_attributes
  const queryConfig: QueryConfig = { ...config, request }
  const fuzziness = config.fuzziness ?? 'AUTO:4,8'

  const filters = [
    ...transformFacetFilters(request, config),
    ...transformNumericFilters(request, config),
    ...transformBaseFilters(request, config),
    ...transformGeoFilters(request, config),
    ...(requestOptions?.getBaseFilters?.() || []),
    ...queryRuleActions.filters.map((filter) => queryStringFilter(config, filter))
  ]

  let organicQuery =
    typeof query === 'string' && query !== ''
      ? requestOptions?.getQuery
        ? requestOptions.getQuery(query, searchAttributes, queryConfig)
        : RelevanceQueryMatch(query, searchAttributes, fuzziness)
      : {
          match_all: {}
        }

  // search_settings.semantic_search: KNN search, combined with the text query unless semantic_only
  const knnQueryBuilder = getKnnQueryBuilder(config, queryVector)
  const hasKnn = typeof knnQueryBuilder.build === 'function'
  const hasNoQuery =
    requestOptions?.getQuery?.(query, searchAttributes, queryConfig) === false ||
    knnQueryBuilder.semanticOnly

  if (hasNoQuery || (hasKnn && query === '')) {
    organicQuery = {
      match_all: {}
    }
  }

  const queryDsl = {
    bool: {
      filter: filters,
      must: queryRuleActions.touched
        ? queryRulesWrapper(organicQuery, queryRuleActions, config)
        : organicQuery
    }
  }

  let knnQueryDsl: KnnSearchQuery | null = null

  if (hasKnn && query !== '') {
    knnQueryDsl = {
      filter: filters,
      ...(knnQueryBuilder.build?.(query) || {})
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
    // `rank_window_size` is the name Elasticsearch 8.15 accepts (`window_size` is rejected); the
    // bundled @elastic/elasticsearch 8.9 types still only know the old name, hence the cast
    rank:
      hasKnn && !hasNoQuery && size > 0 && query !== ''
        ? ({ rrf: { rank_window_size: size } } as unknown as RankContainer)
        : undefined
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

  const runtimeFields = Object.keys(config.runtime_mappings || {})
  const fields = runtimeFields.reduce<string[]>((sum, field) => {
    if (config.result_attributes?.includes(field)) {
      return [field, ...sum]
    }
    return sum
  }, [])

  return {
    _source: {
      includes: Array.from(sourceFields)
    },
    ...(fields.length > 0 ? { fields } : {})
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

const getRuntimeMappings = (request: AlgoliaMultipleQueriesQuery, config: SearchSettingsConfig) => {
  if (!config.runtime_mappings) {
    return {}
  }

  return {
    runtime_mappings: config.runtime_mappings
  }
}

export function transformRequest(
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig,
  queryRuleActions: QueryRuleActions,
  requestOptions?: RequestOptions,
  queryVector?: number[]
): ElasticsearchSearchRequest {
  const query = getQuery(request, config, queryRuleActions, requestOptions, queryVector)
  const body: ElasticsearchSearchRequest = {
    aggs: getAggs(request, config, queryRuleActions),
    ...query,
    ...getResultsSize(request),
    ...getHitFields(request, config),
    // Elasticsearch rejects a highlighter together with `rank` ("[rank] cannot be used with
    // [highlighter]"), so hybrid (RRF) requests carry no highlight; those hits get plain
    // `_highlightResult` values with matchLevel 'none'
    ...(query.rank ? {} : getHighlightFields(request, config)),
    ...getSorting(request, config),
    ...getRuntimeMappings(request, config)
  }

  return body
}
