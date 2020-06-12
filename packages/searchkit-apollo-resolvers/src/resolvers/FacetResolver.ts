import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'
import { SearchkitConfig } from './ResultsResolver'

interface FacetResolverParameters {
  id: string
  query: string
  size: number
}

export default async (parent, parameters: FacetResolverParameters, ctx) => {
  const { queryManager } = ctx
  const config: SearchkitConfig = ctx.config
  const skRequest: SearchkitRequest = ctx.skRequest

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
    const results = await skRequest.search(aggs)
    const facets = getFacetsFromResponse([facet], results)

    return facets[0]
  } catch (e) {
    console.log(e)
  }
}
