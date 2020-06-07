import SearchkitRequest from '../core/SearchkitRequest'

interface HitsParameters {
  page: {
    start: number
    rows: number
  }
}

export default async (parent, parameters: HitsParameters, ctx: { skRequest: SearchkitRequest }) => {
  const { skRequest } = ctx

  try {
    const { hits } = await skRequest.search({
      from: parameters.page ? parameters.page.start : 0,
      size: parameters.page ? parameters.page.rows : 10
    })

    return hits.hits.map((hit) => ({
      id: hit._id,
      fields: hit._source
    }))
  } catch (e) {
    console.log(e)
  }
}
