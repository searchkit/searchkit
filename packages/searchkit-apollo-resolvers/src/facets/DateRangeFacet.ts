import { DateRangeFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface DateRangeFacetConfig {
  identifier: string
  field: string
  label: string
  size?: number
  display?: 'DateRange' | string
}

class DateRangeFacet implements BaseFacet {
  public excludeOwnFilters = true

  constructor(public config: DateRangeFacetConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getIdentifier() {
    return this.config.identifier
  }

  getFilters(filters: Array<DateRangeFilter>) {
    return { range: { [this.config.field]: { gte: filters[0].dateMin, lte: filters[0].dateMax } } }
  }

  getAggregation() {
    return {}
  }

  getSelectedFilter(filterSet) {
    return {
      type: 'DateRangeSelectedFilter',
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      dateMin: filterSet.dateMin,
      dateMax: filterSet.dateMax,
      display: this.config.display || 'DateRangeFacet',
    }
  }

  transformResponse() {
    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      type: 'DateRangeFacet',
      display: this.config.display || 'DateRangeFacet',
      entries: []
    }
  }
}

export default DateRangeFacet
