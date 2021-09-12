import { MixedFilter } from '../core/QueryManager'

export interface BaseFilter {
  getIdentifier(): string
  getLabel(): string
  getFilters(filters: Array<MixedFilter>): any
  getSelectedFilter(filterSet: any): any
}
