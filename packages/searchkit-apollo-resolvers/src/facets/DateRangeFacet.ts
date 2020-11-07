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
  public excludeOwnFilters = true

  constructor(public config: DateRangeFacetConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getId() {
    return this.config.id
  }

  getFilters(filters: Array<DateRangeFilter>) {
    return { range: { [this.config.field]: { gte: filters[0].dateMin, lte: filters[0].dateMax } } }
  }

  getAggregation() {
    return {}
  }

  transformResponse() {
    return {
      id: this.getId(),
      label: this.getLabel(),
      type: 'DateRangeFacet',
      display: this.config.display || 'DateRangeFacet',
      entries: []
    }
  }
}

export default DateRangeFacet
