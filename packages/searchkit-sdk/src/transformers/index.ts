import { ResponseRequest } from ".."
import { getFacetsFromResponse } from "../core/FacetsFns"

export interface SearchkitResponseTransformer {
  transformResponse(responseBody, facetsConfig, queryManager, config, responseRequest): any
}

function getSummaryFromResponse(responseBody, facets, queryManager, config) {
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
        typeof responseBody.hits.total.value === 'number'
          ? responseBody.hits.total.value
          : responseBody.hits.total,
      query: queryManager.getQuery(),
      sortOptions: (config.sortOptions || []).map((sortOption) => ({
        id: sortOption.id,
        label: sortOption.label
      })),
      appliedFilters: appliedFilters,
      disabledFilters: disabledFilters
    }
  }

export class ElasticSearchResponseTransformer implements SearchkitResponseTransformer {

  transformResponse(responseBody, facetsConfig, queryManager, config, responseRequest: ResponseRequest) {
    const { hits } = responseBody

    const facets = responseRequest.facets
      ? getFacetsFromResponse(facetsConfig, responseBody, queryManager)
      : null
    const summary = getSummaryFromResponse(responseBody, facetsConfig, queryManager, config)

    const hitsTotal = (
      typeof hits.total.value === 'number' ? hits.total.value : hits.total
    ) as number

    const size = 0
    const from = 0
    const chosenSortOption = queryManager.getSortBy()

    return {
      summary,
      facets,
      items: hits.hits.map((hit) => ({
        id: hit._id,
        fields: hit._source,
        highlight: hit.highlight,
      })),
      page: {
        total: hitsTotal,
        totalPages: Math.ceil(hitsTotal / size),
        pageNumber: from / size,
        from: from,
        size: size
      },
      sortedBy: chosenSortOption?.id
    }
  }
}
