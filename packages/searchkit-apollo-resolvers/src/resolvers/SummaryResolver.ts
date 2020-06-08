import SearchkitRequest from '../core/SearchkitRequest'
import QueryManager from '../core/QueryManager'
import { SearchkitConfig } from './ResultsResolver'

export default async (parent, {}, ctx) => {
  const skRequest: SearchkitRequest = ctx.skRequest
  const queryManager: QueryManager = ctx.queryManager
  const config: SearchkitConfig = ctx.config

  try {
    const results = await skRequest.search({})
    return {
      total: results.hits.total.value,
      query: queryManager.getQuery(),
      appliedFilters: queryManager.getFilters().reduce((facetFilters, filterSet) => {
        const facetConfig = config.facets.find((facet) => facet.getId() === filterSet.id)
        return [
          ...facetFilters,
          ...filterSet.selected.map((value) => ({
            label: facetConfig.getLabel(),
            id: facetConfig.getId(),
            value
          }))
        ]
      }, [])
    }
  } catch (e) {
    console.log(e)
  }
}
