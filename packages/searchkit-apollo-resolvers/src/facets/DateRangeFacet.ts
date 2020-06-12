import { RangeFilter, DateRangeFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface DateRangeFacetConfig {
  id: string
  field: string
  label: string
  size?: number
  display?: 'DateRange' | string
  range: {
    min: number
    max: number
    interval: number
    min_doc_count?: number
  }
}

class DateRangeFacet implements BaseFacet {
  public TYPE = 'DateRangeFacet'
  public excludeOwnFilters = true

  constructor(public config: DateRangeFacetConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getId() {
    return this.config.id
  }

  getFilter(filter: DateRangeFilter) {
    return { range: { [this.config.field]: { gte: filter.dateMin, lte: filter.dateMax } } }
  }

  getAggregation() {
    return {}
  }

  transformResponse() {
    return {
      id: this.getId(),
      label: this.getLabel(),
      type: this.TYPE,
      display: this.config.display || 'DateRange',
      entries: []
    }
  }
}

export default DateRangeFacet
