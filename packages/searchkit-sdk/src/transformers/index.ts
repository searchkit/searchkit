import {
  SearchHit,
  SearchHitsMetadata,
  SearchInnerHitsResult,
  SearchResponseBody
} from '@elastic/elasticsearch-types/lib/api/types'
import { BaseFacet, FacetResponse, ResponseRequest, SearchkitConfig, SelectedFilter } from '..'
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

export interface SortOption {
  id: string
  label: string
}

export type SummaryResponse = {
  total: number
  appliedFilters: SelectedFilter[]
  disabledFilters: DisabledFilter[]
  query: string
  sortOptions: SortOption[]
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

export interface SearchkitHit {
  id: string
  fields: Record<string, any>
  highlight: Record<string, any>
  innerHits?: Record<string, SearchkitInnerHits>
  rawHit?: Record<string, any>
}

export interface SearchkitPage {
  total: number
  totalPages: number
  pageNumber: number
  from: number
  size: number
}

export interface SearchkitHits {
  items: SearchkitHit[]
  page: SearchkitPage
}

export interface SearchkitInnerHits {
  items: SearchkitHit[]
  total: number
}

export interface SearchkitResponse {
  summary: SummaryResponse
  facets: FacetResponse[]
  hits: SearchkitHits
  sortedBy?: string
}

const getInnerHits = (
  hit: SearchHit<unknown>,
  includeRawHit: boolean
): Record<string, SearchkitInnerHits> =>
  Object.keys(hit.inner_hits).reduce((sum, innerHitKey) => {
    const innerHitGroup: SearchInnerHitsResult = hit.inner_hits[innerHitKey]

    const innerGroup: SearchkitInnerHits = {
      items: innerHitGroup.hits.hits.map((hit) => ({
        id: hit._id,
        fields: hit._source,
        highlight: hit.highlight || {},
        ...(includeRawHit ? { rawHit: hit } : {})
      })),
      total: getHitsTotal(innerHitGroup.hits)
    }

    return {
      ...sum,
      [innerHitKey]: innerGroup
    }
  }, {})

// to support 6.x - 8.x
const getHitsTotal = (hits: SearchHitsMetadata<unknown>): number => {
  // @ts-ignore
  const isNumber = typeof hits.total.value === 'number'
  // @ts-ignore
  return isNumber ? hits.total.value : hits.total
}

export class ElasticSearchResponseTransformer implements SearchkitResponseTransformer {
  transformResponse(
    responseBody: SearchResponseBody,
    facetsConfig,
    queryManager: QueryManager,
    config: SearchkitConfig,
    responseRequest: ResponseRequest
  ): SearchkitResponse {
    const { hits } = responseBody

    const facets = responseRequest.facets
      ? getFacetsFromResponse(facetsConfig, responseBody, queryManager)
      : null
    const summary = getSummaryFromResponse(responseBody, facetsConfig, queryManager, config)

    const hitsTotal = getHitsTotal(hits)

    const size = responseRequest.hits.size
    const from = responseRequest.hits.from
    const chosenSortOption = queryManager.getSortBy()

    return {
      summary,
      facets,
      hits: {
        items: hits.hits.map((hit) => ({
          id: hit._id,
          fields: hit._source,
          highlight: hit.highlight || {},
          ...((config.collapse && {
            innerHits: getInnerHits(hit, responseRequest.hits.includeRawHit)
          }) ||
            {}),
          ...(responseRequest.hits.includeRawHit ? { rawHit: hit } : {})
        })),
        page: {
          total: hitsTotal,
          totalPages: Math.ceil(hitsTotal / size),
          pageNumber: from / size,
          from: from,
          size: size
        }
      },
      sortedBy: chosenSortOption?.id
    }
  }
}
