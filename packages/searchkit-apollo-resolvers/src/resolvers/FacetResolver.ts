import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'
import QueryManager from '../core/QueryManager'
import { SearchkitConfig } from './ResultsResolver'

export interface FacetResolverParameters {
  id: string
  query: string
  size: number
}

export default async (parent, parameters: FacetResolverParameters, ctx) => {
  const queryManager: QueryManager = ctx.searchkit.queryManager
  const config: SearchkitConfig = ctx.searchkit.config
  const skRequest: SearchkitRequest = ctx.searchkit.skRequest

  const facet = config.facets && config.facets.find((facet) => facet.getId() === parameters.id)
  if (!facet) return null

  try {
    const aggs = getAggregationsFromFacets(
      queryManager,
      {
        [facet.getId()]: {
          query: parameters.query,
          size: parameters.size
        }
      },
      [facet]
    )
    const response = await skRequest.search(aggs)
    const facets = getFacetsFromResponse([facet], response)

    return facets[0]
  } catch (e) {
    console.log(e)
  }
}
