import { SearchkitConfig } from '../resolvers/ResultsResolver'

export interface FilterSet {
  id: string
  selected: [string]
}

export default class QueryManager {
  constructor(private filters: Array<FilterSet>, private query: string) {}

  hasFilters(): boolean {
    return (
      this.filters &&
      this.filters.length > 0 &&
      !!this.filters.find((filter) => filter.selected.length > 0)
    )
  }

  hasQuery(): boolean {
    return !!(this.query && this.query.length > 0)
  }

  getQuery(): string {
    return this.query
  }

  getFilterById(id: string): FilterSet {
    if (!this.hasFilters()) return null
    return this.filters.find((filter) => filter.id === id)
  }
}
