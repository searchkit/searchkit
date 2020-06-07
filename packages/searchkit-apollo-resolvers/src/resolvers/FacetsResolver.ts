import SearchkitRequest from '../core/SearchkitRequest'
import FacetsManager from '../core/FacetsManager'

export default async (parent, {}, ctx) => {
  const { queryManager, config } = ctx
  const skRequest: SearchkitRequest = ctx.skRequest

  try {
    const fm = new FacetsManager(queryManager, config.facets)

    const aggs = fm.getAggregations()

    const results = await skRequest.search(aggs)

    const facets = fm.getFacetsFromResponse(results)

    return facets
  } catch (e) {
    console.log(e)
  }
}
