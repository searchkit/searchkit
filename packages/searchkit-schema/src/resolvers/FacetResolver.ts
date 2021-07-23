import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'
import QueryManager from '../core/QueryManager'
import { BaseFacet } from '../facets'

export interface FacetResolverParameters {
  identifier: string
  query: string
  size: number
}

export default async (parent, parameters: FacetResolverParameters, ctx) => {
  const queryManager: QueryManager = parent.searchkit.queryManager
  const skRequest: SearchkitRequest = parent.searchkit.skRequest
  const skFacets: Array<BaseFacet> = parent.searchkit.facets

  // evaluate the facets that are allowed from rules
  const facet =
    skFacets && skFacets.find((facet) => facet.getIdentifier() === parameters.identifier)
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
    const facets = getFacetsFromResponse([facet], response, queryManager)

    return facets[0]
  } catch (e) {
    throw e
  }
}
