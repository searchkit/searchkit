import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'
import QueryManager from '../core/QueryManager'
import { SearchkitConfig } from './ResultsResolver'
import { BaseFacet } from '../facets'

export default async (parent, {}, ctx) => {
  const queryManager: QueryManager = parent.searchkit.queryManager
  const skRequest: SearchkitRequest = parent.searchkit.skRequest
  const skFacets: Array<BaseFacet> = parent.searchkit.facets
  if (!skFacets || skFacets.length === 0) return null

  try {
    const aggs = getAggregationsFromFacets(queryManager, {}, skFacets)
    const results = await skRequest.search(aggs)
    const facets = getFacetsFromResponse(skFacets, results)

    return facets
  } catch (e) {
    throw e
  }
}
