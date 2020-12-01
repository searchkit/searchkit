import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'
import QueryManager from '../core/QueryManager'
import { SearchkitConfig } from './ResultsResolver'

export default async (parent, {}, ctx) => {
  const queryManager: QueryManager = ctx.searchkit.queryManager
  const config: SearchkitConfig = ctx.searchkit.config
  const skRequest: SearchkitRequest = ctx.searchkit.skRequest
  if (!config.facets) return null

  try {
    const aggs = getAggregationsFromFacets(queryManager, {}, config.facets)
    const results = await skRequest.search(aggs)
    const facets = getFacetsFromResponse(config.facets, results)

    return facets
  } catch (e) {
    console.log(e)
  }
}
