import SearchkitRequest from '../core/SearchkitRequest'

export interface HitsParameters {
  page: {
    from: number
    size: number
  }
}

export default async (parent, parameters: HitsParameters, ctx: { skRequest: SearchkitRequest }) => {
  const { skRequest } = ctx

  try {
    const from = parameters.page?.from || 0
    const size = parameters.page?.size || 10

    const { hits } = await skRequest.search({
      from: from,
      size: size
    })

    return {
      items: hits.hits.map((hit) => ({
        id: hit._id,
        fields: hit._source
      })),
      page: {
        total: hits.total.value,
        totalPages: Math.ceil(hits.total.value / size),
        pageNumber: from / size,
        from: from,
        size: size
      }
    }
  } catch (e) {
    console.log(e)
  }
}
