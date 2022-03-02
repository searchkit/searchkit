import { BaseFacet, FacetResponse, ResponseRequest, SelectedFilter } from '..'
import { getFacetsFromResponse } from '../core/FacetsFns'
import QueryManager from '../core/QueryManager'

export interface SearchkitResponseTransformer {
  transformResponse(responseBody, facetsConfig, queryManager, config, responseRequest): any
}

function isSelectedDisabledFilter(filter): filter is DisabledFilter {
  return (filter as DisabledFilter).disabled
}

export type DisabledFilter = {
  disabled: true
  identifier: string
}

export type SummaryResponse = {
  total: number
  appliedFilters: SelectedFilter[]
  disabledFilters: DisabledFilter[]
  query: string
  sortOptions: { id: string; label: string }[]
}

function getSummaryFromResponse(
  responseBody,
  facets,
  queryManager: QueryManager,
  config
): SummaryResponse {
  const combinedFilters = [...(facets || []), ...(config.filters || [])]
  const filters = queryManager.getFilters().map((filterSet) => {
    const facetConfig: BaseFacet = combinedFilters.find(
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
  const {
    appliedFilters,
    disabledFilters
  }: { appliedFilters: SelectedFilter[]; disabledFilters: DisabledFilter[] } = filters.reduce(
    (sum, filter) => {
      if (isSelectedDisabledFilter(filter)) {
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
    query: queryManager.getQuery() || '',
    sortOptions: (config.sortOptions || []).map((sortOption) => ({
      id: sortOption.id,
      label: sortOption.label
    })),
    appliedFilters: appliedFilters,
    disabledFilters: disabledFilters
  }
}

interface SearchkitHit {
  id: string
  fields: Record<string, any>
  highlight: Record<string, any>
}

interface SearchkitPage {
  total: number
  totalPages: number
  pageNumber: number
  from: number
  size: number
}

export interface SearchkitResponse {
  summary: SummaryResponse
  facets: FacetResponse[]
  items: SearchkitHit[]
  page: SearchkitPage
  sortedBy?: string
}

export class ElasticSearchResponseTransformer implements SearchkitResponseTransformer {
  transformResponse(
    responseBody,
    facetsConfig,
    queryManager: QueryManager,
    config,
    responseRequest: ResponseRequest
  ): SearchkitResponse {
    const { hits } = responseBody

    const facets = responseRequest.facets
      ? getFacetsFromResponse(facetsConfig, responseBody, queryManager)
      : null
    const summary = getSummaryFromResponse(responseBody, facetsConfig, queryManager, config)

    const hitsTotal = (
      typeof hits.total.value === 'number' ? hits.total.value : hits.total
    ) as number

    const size = responseRequest.hits.size
    const from = responseRequest.hits.from
    const chosenSortOption = queryManager.getSortBy()

    return {
      summary,
      facets,
      items: hits.hits.map((hit) => ({
        id: hit._id,
        fields: hit._source,
        highlight: hit.highlight
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
