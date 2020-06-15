import { MixedFilter } from '../core/QueryManager'

export interface FacetOptions {
  size: number
  query: string
}

export interface BaseFacet {
  TYPE: string
  excludeOwnFilters: boolean
  getId(): string
  getLabel(): string
  getAggregation(overrides: FacetOptions): any
  getFilters(filters: Array<MixedFilter>): any
  transformResponse(response: any): any
}
