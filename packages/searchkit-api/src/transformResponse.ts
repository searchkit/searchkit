import { stringify } from 'querystring'
import { SearchSettingsConfig } from './types'
import { getHighlightFields, highlightTerm } from './highlightUtils'
import { AlgoliaMultipleQueriesQuery, ElasticsearchResponseBody } from './types'
import { getFacetFieldType } from './utils'
import { QueryRuleActions } from './queryRules'

type FacetsList = Record<string, Record<string, number>>
type FacetsStats = Record<string, { min: number; max: number; avg: number; sum: number }>

const getHits = (
  response: ElasticsearchResponseBody,
  config: SearchSettingsConfig,
  instantsearchRequest: AlgoliaMultipleQueriesQuery
) => {
  const { hits } = response
  const { highlight_attributes = [], snippet_attributes = [] } = config

  return hits.hits.map((hit) => ({
    objectID: hit._id,
    ...(hit._source || {}),
    ...(highlight_attributes.length > 0
      ? {
          _highlightResult: getHighlightFields(
            hit,
            instantsearchRequest?.params?.highlightPreTag,
            instantsearchRequest?.params?.highlightPostTag,
            highlight_attributes
          )
        }
      : {}),
    ...(snippet_attributes.length > 0
      ? {
          _snippetResult: getHighlightFields(
            hit,
            instantsearchRequest?.params?.highlightPreTag,
            instantsearchRequest?.params?.highlightPostTag,
            config.snippet_attributes
          )
        }
      : {})
  }))
}

const getFacets = (response: ElasticsearchResponseBody, config: SearchSettingsConfig) => {
  if (!response?.aggregations) {
    return {}
  }

  // flattening for nested facets
  const aggregations = Object.keys(response.aggregations).reduce<Record<string, any>>(
    (sum, key) => {
      const value = (response.aggregations || {})[key] as any

      if (key.endsWith('.')) {
        const { doc_count, ...nestedAggregations } = value
        return {
          ...sum,
          ...nestedAggregations
        }
      }

      return {
        ...sum,
        [key]: value
      }
    },
    {}
  )

  return Object.keys(aggregations).reduce<{
    facets: FacetsList
    facets_stats: FacetsStats
  }>(
    (sum, f) => {
      const facet = f.split('$')[0]
      const fieldType = getFacetFieldType(config.facet_attributes || [], facet)

      if (fieldType === 'numeric') {
        const facetValues = aggregations[facet + '$_stats'] as any
        const { buckets } = aggregations[facet + '$_entries'] as {
          buckets: any[]
        }

        return {
          ...sum,
          facets: {
            ...sum.facets,
            [facet]: buckets.reduce<Record<string, number>>(
              (sum, bucket) => ({
                ...sum,
                [bucket.key]: bucket.doc_count
              }),
              {}
            )
          },
          facets_stats: {
            ...sum.facets_stats,
            [facet]: {
              min: facetValues.min,
              avg: facetValues.avg,
              max: facetValues.max,
              sum: facetValues.sum
            }
          }
        }
      }

      const { buckets } = aggregations[facet] as { buckets: any[] }

      return {
        ...sum,
        facets: {
          ...sum.facets,
          [facet]: buckets.reduce<Record<string, number>>(
            (sum, bucket) => ({
              ...sum,
              [bucket.key]: bucket.doc_count
            }),
            {}
          )
        }
      }
    },
    {
      facets: {},
      facets_stats: {}
    }
  )
}

const getRenderingContent = (config: SearchSettingsConfig, queryRuleActions: QueryRuleActions) => {
  const defaultOrder = config.facet_attributes?.map((facet) =>
    typeof facet === 'string' ? facet : facet.attribute
  )

  return {
    renderingContent: {
      facetOrdering: {
        facets: {
          order: queryRuleActions.facetAttributesOrder || defaultOrder || []
        },
        values: config.facet_attributes?.reduce<Record<string, { sortRemainingBy: 'count' }>>(
          (sum, facet) => {
            const facetName = typeof facet === 'string' ? facet : facet.attribute

            // If request has explicit facet orders and the facet is not
            // in the query rule actions, we don't want to sort it
            if (
              queryRuleActions.facetAttributesOrder &&
              !queryRuleActions.facetAttributesOrder.includes(facetName)
            ) {
              return sum
            }

            return {
              ...sum,
              [facetName]: {
                sortRemainingBy: 'count'
              }
            }
          },
          {}
        )
      }
    }
  }
}

const getPageDetails = (
  response: ElasticsearchResponseBody,
  request: AlgoliaMultipleQueriesQuery,
  queryRuleActions: QueryRuleActions
) => {
  const { params = {} } = request
  const { hitsPerPage = 20, page = 0 } = params

  const { total } = response.hits
  const totalHits = typeof total === 'number' ? total : total?.value
  const nbPages =
    hitsPerPage <= 0
      ? 0
      : Math.ceil((typeof total === 'number' ? total : total?.value || 0) / hitsPerPage)

  return {
    hitsPerPage,
    processingTimeMS: response.took,
    nbHits: totalHits,
    page: page,
    nbPages,
    query: queryRuleActions.query
  }
}

export default function transformResponse(
  response: ElasticsearchResponseBody,
  instantsearchRequest: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig,
  queryRuleActions: QueryRuleActions
) {
  try {
    return {
      appliedRules: queryRuleActions.ruleIds,
      exhaustiveNbHits: true,
      exhaustiveFacetsCount: true,
      exhaustiveTypo: true,
      exhaustive: { facetsCount: true, nbHits: true, typo: true },
      ...getPageDetails(response, instantsearchRequest, queryRuleActions),
      ...getRenderingContent(config, queryRuleActions),
      ...getFacets(response, config),
      hits: getHits(response, config, instantsearchRequest),
      index: instantsearchRequest.indexName,
      params: stringify(instantsearchRequest.params as any),
      ...(queryRuleActions.userData.length > 0 ? { userData: queryRuleActions.userData } : {})
    }
  } catch (e) {
    throw new Error(`Error transforming Elasticsearch response for index`)
  }
}

export const transformFacetValuesResponse = (
  response: ElasticsearchResponseBody,
  instantsearchRequest: AlgoliaMultipleQueriesQuery
) => {
  const aggregations = response.aggregations || {}

  const preTag = instantsearchRequest.params?.highlightPreTag || '<ais-highlight-0000000000>'
  const postTag = instantsearchRequest.params?.highlightPostTag || '<ais-highlight-0000000000/>'

  return {
    facetHits: (aggregations[Object.keys(aggregations)[0]] as any).buckets.map((entry: any) => ({
      value: entry.key,
      highlighted: highlightTerm(
        entry.key,
        // @ts-ignore
        instantsearchRequest.params.facetQuery || ''
      )
        .replace(/<\em>/g, preTag)
        .replace(/<\/\em>/g, postTag),
      count: entry.doc_count
    })),
    exhaustiveFacetsCount: true,
    processingTimeMS: response.took
  }
}
