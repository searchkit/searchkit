import isUndefined from 'lodash/isUndefined'
import { DateRangeFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface DateRangeFacetConfig {
  identifier: string
  field: string
  label: string
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
    const rangeFilter: { gte?: string; lte?: string } = {}
    if (!isUndefined(filters[0].dateMin)) rangeFilter.gte = filters[0].dateMin
    if (!isUndefined(filters[0].dateMax)) rangeFilter.lte = filters[0].dateMax
    return { range: { [this.config.field]: rangeFilter } }
  }

  getAggregation() {
    return {}
  }

  getSelectedFilter(filterSet) {
    return {
      type: 'DateRangeSelectedFilter',
      id: `${this.getIdentifier()}_${filterSet.dateMin}_${filterSet.dateMax}`,
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      dateMin: filterSet.dateMin,
      dateMax: filterSet.dateMax,
      display: this.config.display || 'DateRangeFacet'
    }
  }

  transformResponse() {
    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      type: 'DateRangeFacet',
      display: this.config.display || 'DateRangeFacet',
      entries: null
    }
  }
}

export default DateRangeFacet
