import QueryManager, { MixedFilter } from '../core/QueryManager'

export interface FacetOptions {
  size: number
  query: string
}

export interface SelectedFilter {
  type: string
  id: string
  identifier: string
  label: string
  dateMin?: string
  dateMax?: string
  display: string
}

export interface FacetResponseEntry {
  label: string
  count: string
}

export interface FacetResponse {
  identifier: string
  label: string
  type: string
  display: string
  entries?: FacetResponseEntry[]
}

export interface BaseFacet {
  excludeOwnFilters: boolean
  getIdentifier(): string
  getLabel(): string
  getAggregation(overrides: FacetOptions, queryManager: QueryManager): any
  getFilters(filters: Array<MixedFilter>): any
  transformResponse(response: any, queryManager: QueryManager): FacetResponse
  getSelectedFilter(filterSet: any): SelectedFilter
}
