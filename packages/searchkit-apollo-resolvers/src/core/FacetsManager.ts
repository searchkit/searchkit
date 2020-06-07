import { SearchResponse } from 'elasticsearch'
import { BaseFacet } from '../facets/BaseFacet'
import QueryManager from './QueryManager'
import { filterTransform } from './transformers'

class FacetsManager {
  constructor(private queryManager: QueryManager, private facetsConfig: Array<BaseFacet> = []) {}

  public getAggregations() {
    const aggBuckets = this.facetsConfig.reduce(
      (buckets, facet) => {
        if (facet.SELECTOR === 'OR') {
          buckets.push({
            name: `facet_bucket_${facet.getId()}`,
            aggs: [facet],
            filters: this.facetsConfig.filter((f) => f !== facet)
          })
        } else {
          const combinedBucket = buckets.find(({ name }) => name === 'facet_bucket_all')
          combinedBucket.aggs.push(facet)
        }
        return buckets
      },
      [{ name: 'facet_bucket_all', aggs: [], filters: [...this.facetsConfig] }]
    )

    const aggs = aggBuckets.reduce((sum, bucket) => {
      const subAggs = bucket.aggs.reduce(
        (subAggs, subAgg: BaseFacet) => ({
          ...subAggs,
          ...subAgg.getAggregation()
        }),
        {}
      )
      return {
        ...sum,
        [bucket.name]: {
          aggs: subAggs,
          filter: filterTransform(this.queryManager, bucket.filters)
        }
      }
    }, {})

    return { aggs }
  }

  public getFacetsFromResponse(response: SearchResponse<any>) {
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

    return this.facetsConfig.map((facet) => {
      const aggFacetResponse = collapsedFacetAggsMap[facet.getId()]
      return facet.transformResponse(aggFacetResponse)
    })
  }
}

export default FacetsManager
