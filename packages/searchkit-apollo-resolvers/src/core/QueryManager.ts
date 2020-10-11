export type ValueFilter = {
  type: 'Value'
  id: string
  value: string
}

export type RangeFilter = {
  type: 'Range'
  id: string
  min: number
  max: number
}

export type DateRangeFilter = {
  type: 'DateRange'
  id: string
  dateMin: string
  dateMax: string
}

export type MixedFilter = ValueFilter | RangeFilter | DateRangeFilter

export default class QueryManager {
  constructor(private filters: Array<MixedFilter>, private query: string) {}

  hasFilters(): boolean {
    return this.filters && this.filters.length > 0
  }

  hasQuery(): boolean {
    return !!(this.query && this.query.length > 0)
  }

  getQuery(): string {
    return this.query
  }

  getFilters(): Array<MixedFilter> {
    return this.hasFilters() ? this.filters : []
  }

  getFiltersById(id: string): Array<MixedFilter> {
    if (!this.hasFilters()) return null
    const idFilters = this.filters.filter((filter) => filter.id === id)
    return idFilters.length > 0 ? idFilters : null
  }
}
