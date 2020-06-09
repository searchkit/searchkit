import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'

export default async (parent, {}, ctx) => {
  const { queryManager, config } = ctx
  const skRequest: SearchkitRequest = ctx.skRequest
  if (!config.facets) return null

  try {
    const aggs = getAggregationsFromFacets(queryManager, config.facets)
    const results = await skRequest.search(aggs)
    const facets = getFacetsFromResponse(config.facets, results)

    return facets
  } catch (e) {
    console.log(e)
  }
}
