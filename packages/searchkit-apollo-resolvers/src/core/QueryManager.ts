export interface FilterSet {
  id: string
  selected: string[]
}

export interface RangeFilter {
  id: string
  min: number
  max: number
}

export interface DateRangeFilter {
  id: string
  dateMin: string
  dateMax: string
}

export default class QueryManager {
  constructor(
    private filters: Array<FilterSet | RangeFilter | DateRangeFilter>,
    private query: string
  ) {}

  hasFilters(): boolean {
    return this.filters && this.filters.length > 0
  }

  hasQuery(): boolean {
    return !!(this.query && this.query.length > 0)
  }

  getQuery(): string {
    return this.query
  }

  getFilters(): Array<FilterSet | RangeFilter | DateRangeFilter> {
    return this.hasFilters() ? this.filters : []
  }

  getFilterById(id: string): FilterSet | RangeFilter | DateRangeFilter {
    if (!this.hasFilters()) return null
    return this.filters.find((filter) => filter.id === id) || null
  }
}
