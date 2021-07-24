import QueryManager, { MixedFilter } from '../core/QueryManager'

export interface FacetOptions {
  size: number
  query: string
}

export interface BaseFacet {
  excludeOwnFilters: boolean
  getIdentifier(): string
  getLabel(): string
  getAggregation(overrides: FacetOptions, queryManager: QueryManager): any
  getFilters(filters: Array<MixedFilter>): any
  transformResponse(response: any, queryManager: QueryManager): any
  getSelectedFilter(filterSet: any): any
}
