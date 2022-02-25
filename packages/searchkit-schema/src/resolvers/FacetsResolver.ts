import { DataRequest } from './ResultsResolver'

export default async (parent, {}, ctx) => {
  const dataRequest = parent.searchkit.dataRequest as DataRequest

  dataRequest.setFacets(true)

  try {
    const results = await dataRequest.search()

    return results.facets
  } catch (e) {
    throw e
  }
}
