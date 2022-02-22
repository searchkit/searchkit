import { DataRequest } from './ResultsResolver'

export default async (parent, {}, ctx) => {
  const dataRequest = parent.searchkit.dataRequest as DataRequest

  try {
    const response = await dataRequest.search()

    return response.summary
  } catch (e) {
    throw e
  }
}
