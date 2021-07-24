import SearchkitRequest from '../core/SearchkitRequest'
import QueryManager from '../core/QueryManager'
import { BaseFacet, VisibleWhenRuleSet } from '../facets'
import { SearchkitConfig } from './ResultsResolver'

export default async (parent, {}, ctx) => {
  const queryManager: QueryManager = parent.searchkit.queryManager
  const config: SearchkitConfig = parent.searchkit.config
  const skRequest: SearchkitRequest = parent.searchkit.skRequest
  const facets = parent.searchkit.facets

  try {
    const results = await skRequest.search({})
    const combinedFilters = [...(facets || []), ...(config.filters || [])]
    const filters = queryManager.getFilters().map((filterSet) => {
      const facetConfig = combinedFilters.find(
        (facet) => facet.getIdentifier() === filterSet.identifier
      )
      if (!facetConfig) {
        return {
          identifier: filterSet.identifier,
          disabled: true
        }
      }
      return facetConfig.getSelectedFilter(filterSet)
    })
    const { appliedFilters, disabledFilters } = filters.reduce(
      (sum, filter) => {
        if (filter.disabled) {
          sum.disabledFilters.push(filter)
        } else {
          sum.appliedFilters.push(filter)
        }
        return sum
      },
      { appliedFilters: [], disabledFilters: [] }
    )

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
      appliedFilters: appliedFilters,
      disabledFilters: disabledFilters
    }
  } catch (e) {
    throw e
  }
}
