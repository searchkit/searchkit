import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'
import QueryManager from '../core/QueryManager'
import { SearchkitConfig } from './ResultsResolver'

export default async (parent, {}, ctx) => {
  const queryManager: QueryManager = parent.searchkit.queryManager
  const config: SearchkitConfig = parent.searchkit.config
  const skRequest: SearchkitRequest = parent.searchkit.skRequest
  if (!config.facets) return null

  try {
    const aggs = getAggregationsFromFacets(queryManager, {}, config.facets)
    const results = await skRequest.search(aggs)
    const facets = getFacetsFromResponse(config.facets, results)

    return facets
  } catch (e) {
    throw e
  }
}
