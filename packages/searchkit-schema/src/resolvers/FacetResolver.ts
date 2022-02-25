import { DataRequest } from './ResultsResolver'

export interface FacetResolverParameters {
  identifier: string
  query?: string
  size?: number
}

export default async (parent, parameters: FacetResolverParameters, ctx) => {
  const dataRequest = parent.searchkit.dataRequest as DataRequest

  dataRequest.setFacets(true)
  dataRequest.setFacetsCriteria([
    { identifier: parameters.identifier, query: parameters.query, size: parameters.size }
  ])

  try {
    const response = await dataRequest.search()
    return response.facets.find((facet) => facet.identifier === parameters.identifier)
  } catch (e) {
    throw e
  }
}
