import { FilterSet, RangeFilter } from '../core/QueryManager'
import DateRangeFacet from './DateRangeFacet'

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
  getFilter(filter: FilterSet | RangeFilter | DateRangeFacet): any
  transformResponse(response: any): any
}
