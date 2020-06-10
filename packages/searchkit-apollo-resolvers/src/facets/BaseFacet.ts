import { FilterSet, RangeFilter } from '../core/QueryManager'

export interface BaseFacet {
  TYPE: string
  SELECTOR: string
  getId(): string
  getLabel(): string
  getAggregation(): any
  getFilter(filter: FilterSet | RangeFilter): any
  transformResponse(response: any): any
}
