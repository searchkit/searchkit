import { BaseFacet } from '../facets/BaseFacet'
import { BaseFilter } from '../filters'
import QueryManager from './QueryManager'
import { SearchResponse } from './SearchkitRequest'

export const facetFilterTransform = (
  queryManager: QueryManager,
  facets: Array<BaseFilter> = []
) => {
  const subFilters = facets.reduce((subFilters, facet) => {
    const facetSubFilter = queryManager.getFiltersById(facet.getIdentifier())
    if (facetSubFilter) {
      return [...subFilters, facet.getFilters(facetSubFilter)]
    }
    return subFilters
  }, [])

  return subFilters.length ? { bool: { must: subFilters } } : null
}

export const filterTransform = (queryManager: QueryManager, filters: Array<BaseFilter> = []) => {
  const subFilters = filters.reduce((subFilters, filter) => {
    const filterSubFilter = queryManager.getFiltersById(filter.getIdentifier())
    if (filterSubFilter) {
      return [...subFilters, filter.getFilters(filterSubFilter)]
    }
    return subFilters
  }, [])

  return subFilters.length ? subFilters : null
}

export const getAggregationsFromFacets = (
  queryManager: QueryManager,
  overrides: any,
  facetsConfig: Array<BaseFacet | BaseFilter>
) => {
  const aggBuckets = facetsConfig.reduce(
    (buckets, facet) => {
      if (facet.excludeOwnFilters && queryManager.hasFilters()) {
        buckets.push({
          name: `facet_bucket_${facet.getIdentifier()}`,
          aggs: [facet],
          filters: facetsConfig.filter((f) => f !== facet)
        })
      } else {
        const combinedBucket = buckets.find(({ name }) => name === 'facet_bucket_all')
        combinedBucket.aggs.push(facet)
      }
      return buckets
    },
    [{ name: 'facet_bucket_all', aggs: [], filters: [...facetsConfig] }]
  )

  const aggs = aggBuckets.reduce((sum, bucket) => {
    const subAggs = bucket.aggs.reduce(
      (subAggs, subAgg: BaseFacet) => ({
        ...subAggs,
        ...subAgg.getAggregation(overrides[subAgg.getIdentifier()])
      }),
      {}
    )
    const filter = facetFilterTransform(queryManager, bucket.filters)
    return {
      ...sum,
      [bucket.name]: {
        aggs: subAggs,
        filter: filter || { bool: { must: [] } }
      }
    }
  }, {})

  return { aggs }
}

export const getFacetsFromResponse = (
  facetsConfig: Array<BaseFacet | BaseFilter>,
  response: SearchResponse<any>
) => {
  const facetBucketKeys = Object.keys(response.aggregations).filter(
    (aggKey) => aggKey.indexOf('facet_bucket_') !== -1
  )
  const collapsedFacetAggsMap = facetBucketKeys.reduce((facetAggsResponse, bucketKey) => {
    const facetBucket = response.aggregations[bucketKey]
    const subAggKeys = Object.keys(facetBucket).filter(
      (key) => key !== 'meta' && key !== 'doc_count'
    )
    return {
      ...facetAggsResponse,
      ...subAggKeys.reduce(
        (sum, key) => ({
          ...sum,
          [key]: facetBucket[key]
        }),
        {}
      )
    }
  }, {})

  return facetsConfig
    .map((facet) => {
      const aggFacetResponse = collapsedFacetAggsMap[facet.getIdentifier()]
      if ('transformResponse' in facet) {
        return facet.transformResponse(aggFacetResponse)
      }
      return {}
    })
    .filter((transformedFacet) => transformedFacet !== null)
}
