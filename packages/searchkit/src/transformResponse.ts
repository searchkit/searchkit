import { SearchSettingsConfig } from './types'
import { getHighlightFields, highlightTerm } from './highlightUtils'
import { AlgoliaMultipleQueriesQuery, ElasticsearchResponseBody } from './types'
import { getFacetFieldType } from './utils'
import { QueryRuleActions } from './queryRules'
import type { AggregationsStatsAggregate, GeoLocation } from '@elastic/elasticsearch/lib/api/types'

type FacetsList = Record<string, Record<string, number>>
type FacetsStats = Record<
  string,
  { min: number | null; max: number | null; avg: number | null; sum: number | null }
>

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
    ...(hit.inner_hits ? { inner_hits: hit.inner_hits } : {}),
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
      : {}),
    ...(config.geo_attribute && hit._source?.[config.geo_attribute]
      ? { _geoloc: convertLatLng(hit._source?.[config.geo_attribute] as GeoLocation) }
      : {})
  }))
}

function convertLatLng(value: GeoLocation) {
  if (typeof value === 'string') {
    const [lat, lng] = value.split(',').map((v) => parseFloat(v))
    return { lat, lng }
  } else if (Array.isArray(value)) {
    return { lat: value[0], lng: value[1] }
  } else if (typeof value === 'object') {
    if ('lat' in value && 'lon' in value) {
      return {
        lat: parseFloat(value.lat as unknown as string),
        lng: parseFloat(value.lon as unknown as string)
      }
    }
  }
  return null
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
        const facetValues = aggregations[facet + '$_stats'] as AggregationsStatsAggregate
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
      params: new URLSearchParams(instantsearchRequest.params as any).toString(),
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
  // @ts-ignore
  const facetName = instantsearchRequest?.params?.facetName

  const preTag = instantsearchRequest.params?.highlightPreTag || '<ais-highlight-0000000000>'
  const postTag = instantsearchRequest.params?.highlightPostTag || '<ais-highlight-0000000000/>'

  let agg = aggregations[Object.keys(aggregations)[0]] as any

  if (agg && agg[facetName]) {
    agg = agg[facetName]
  }

  return {
    facetHits: agg.buckets.map((entry: any) => ({
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
