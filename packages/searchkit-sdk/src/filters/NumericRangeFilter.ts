import isUndefined from 'lodash/isUndefined'
import { RangeFilter } from '../core/QueryManager'
import { BaseFilter } from './BaseFilter'

interface NumericRangeFilterConfig {
  identifier: string
  field: string
  label: string
  display?: 'Slider' | string
}

class NumericRangeFilter implements BaseFilter {
  constructor(public config: NumericRangeFilterConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getIdentifier(): string {
    return this.config.identifier
  }

  getFilters(filters: Array<RangeFilter>) {
    const rangeFilter: { gte?: number; lte?: number } = {}
    if (!isUndefined(filters[0].min)) rangeFilter.gte = filters[0].min
    if (!isUndefined(filters[0].max)) rangeFilter.lte = filters[0].max
    return { range: { [this.config.field]: rangeFilter } }
  }

  getSelectedFilter(filterSet) {
    return {
      identifier: this.getIdentifier(),
      id: `${this.getIdentifier()}_${filterSet.min}_${filterSet.max}`,
      label: this.getLabel(),
      display: this.config.display || 'RangeFilter',
      type: 'NumericRangeSelectedFilter',
      min: filterSet.min,
      max: filterSet.max
    }
  }
}

export default NumericRangeFilter
