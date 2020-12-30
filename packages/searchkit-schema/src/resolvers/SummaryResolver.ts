import SearchkitRequest from '../core/SearchkitRequest'
import QueryManager from '../core/QueryManager'
import { SearchkitConfig } from './ResultsResolver'

export default async (parent, {}, ctx) => {
  const queryManager: QueryManager = parent.searchkit.queryManager
  const config: SearchkitConfig = parent.searchkit.config
  const skRequest: SearchkitRequest = parent.searchkit.skRequest

  try {
    const results = await skRequest.search({})
    return {
      total:
        typeof results.hits.total.value === 'number'
          ? results.hits.total.value
          : results.hits.total,
      query: queryManager.getQuery(),
      sortOptions: config.sortOptions.map((sortOption) => ({
        id: sortOption.id,
        label: sortOption.label
      })),
      appliedFilters: queryManager.getFilters().map((filterSet) => {
        const facetConfig = config.facets.find(
          (facet) => facet.getIdentifier() === filterSet.identifier
        )
        return facetConfig.getSelectedFilter(filterSet)
      }, [])
    }
  } catch (e) {
    console.log(e)
  }
}
