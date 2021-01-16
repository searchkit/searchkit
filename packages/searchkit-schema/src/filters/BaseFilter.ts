import { MixedFilter } from '../core/QueryManager'

export interface BaseFilter {
  excludeOwnFilters: boolean
  getIdentifier(): string
  getLabel(): string
  getFilters(filters: Array<MixedFilter>): any
  getSelectedFilter(filterSet: any): any
}
