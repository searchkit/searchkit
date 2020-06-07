import { FilterSet } from '../core/QueryManager'

export interface BaseFacet {
  TYPE: string
  SELECTOR: string
  getId(): string
  getLabel(): string
  getAggregation(): any
  getFilter(filter: FilterSet): any
  transformResponse(response: any): any
}
