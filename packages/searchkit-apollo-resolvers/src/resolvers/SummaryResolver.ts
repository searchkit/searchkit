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
      total: results.hits.total.value ? results.hits.total.value : results.hits.total,
      query: queryManager.getQuery(),
      sortOptions: config.sortOptions.map((sortOption) => ({
        id: sortOption.id,
        label: sortOption.label
      })),
      appliedFilters: queryManager.getFilters().map((filterSet) => {
        const facetConfig = config.facets.find((facet) => facet.getId() === filterSet.id)
        return {
          label: facetConfig.getLabel(),
          id: facetConfig.getId(),
          value: filterSet.value
        }
      }, [])
    }
  } catch (e) {
    console.log(e)
  }
}
