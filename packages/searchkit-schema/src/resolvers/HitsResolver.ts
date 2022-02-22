import { DataRequest } from './ResultsResolver'

export interface HitsParameters {
  page: {
    from: number
    size: number
  }
  sortBy?: string
}

export default async (parent, parameters: HitsParameters, ctx) => {
  const dataRequest = parent.searchkit.dataRequest as DataRequest

  try {
    const from = parameters.page?.from || 0
    const size = parameters.page?.size || 10

    dataRequest.setHits({
      size,
      from,
      sortId: parameters.sortBy
    })

    const { items, page, sortedBy } = await dataRequest.search()

    return {
      items: items.map((item) => ({
        ...item,
        type: parent.searchkit.hitType
      })),
      page: page,
      sortedBy
    }
  } catch (e) {
    throw e
  }
}
