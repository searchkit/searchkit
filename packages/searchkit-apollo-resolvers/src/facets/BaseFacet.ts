import { FilterSet, RangeFilter } from '../core/QueryManager'

export interface BaseFacet {
  TYPE: string
  excludeOwnFilters: boolean
  getId(): string
  getLabel(): string
  getAggregation(): any
  getFilter(filter: FilterSet | RangeFilter): any
  transformResponse(response: any): any
}
