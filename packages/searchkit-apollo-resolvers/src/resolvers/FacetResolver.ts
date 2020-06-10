import SearchkitRequest from '../core/SearchkitRequest'
import { getAggregationsFromFacets, getFacetsFromResponse } from '../core/FacetsFns'
import { SearchkitConfig } from './ResultsResolver'

interface FacetResolverParameters {
  id: string
  query: string
  page: {
    from: number
    size: number
  }
}

export default async (parent, parameters: FacetResolverParameters, ctx) => {
  const { queryManager } = ctx
  const config: SearchkitConfig = ctx.config
  const skRequest: SearchkitRequest = ctx.skRequest

  const facet = config.facets && config.facets.find((facet) => facet.getId())
  if (!facet) return null

  try {
    const aggs = getAggregationsFromFacets(queryManager, [facet])
    const results = await skRequest.search(aggs)
    const facets = getFacetsFromResponse([facet], results)

    return facets[0]
  } catch (e) {
    console.log(e)
  }
}
