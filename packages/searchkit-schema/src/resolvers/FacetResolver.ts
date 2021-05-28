import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'
import QueryManager from '../core/QueryManager'
import { SearchkitConfig } from './ResultsResolver'

export interface FacetResolverParameters {
  identifier: string
  query: string
  size: number
}

export default async (parent, parameters: FacetResolverParameters, ctx) => {
  const queryManager: QueryManager = parent.searchkit.queryManager
  const config: SearchkitConfig = parent.searchkit.config
  const skRequest: SearchkitRequest = parent.searchkit.skRequest

  const facet =
    config.facets && config.facets.find((facet) => facet.getIdentifier() === parameters.identifier)
  if (!facet) return null

  try {
    const aggs = getAggregationsFromFacets(
      queryManager,
      {
        [facet.getIdentifier()]: {
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
