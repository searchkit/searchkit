import _ from 'lodash'
import { RangeFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface RangeFacetConfig {
  identifier: string
  field: string
  label: string
  size?: number
  display?: 'Slider' | string
  range: {
    min: number
    max: number
    interval: number
    min_doc_count?: number
  }
}

class RangeFacet implements BaseFacet {
  public excludeOwnFilters = true

  constructor(public config: RangeFacetConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getIdentifier(): string {
    return this.config.identifier
  }

  getFilters(filters: Array<RangeFilter>) {
    const rangeFilter: { gte?: number; lte?: number } = {}
    if (!_.isUndefined(filters[0].min)) rangeFilter.gte = filters[0].min
    if (!_.isUndefined(filters[0].max)) rangeFilter.lte = filters[0].max
    return { range: { [this.config.field]: rangeFilter } }
  }

  getAggregation() {
    return {
      [this.getIdentifier()]: {
        histogram: {
          field: this.config.field,
          interval: this.config.range.interval,
          min_doc_count: this.config.range.min_doc_count || 0,
          extended_bounds: { min: this.config.range.min, max: this.config.range.max }
        }
      }
    }
  }

  getSelectedFilter(filterSet) {
    return {
      identifier: this.getIdentifier(),
      id: `${this.getIdentifier()}_${filterSet.min}_${filterSet.max}`,
      label: this.getLabel(),
      display: this.config.display || 'RangeSliderFacet',
      type: 'NumericRangeSelectedFilter',
      min: filterSet.min,
      max: filterSet.max
    }
  }

  transformResponse(response: any) {
    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      display: this.config.display || 'RangeSliderFacet',
      type: 'RangeFacet',
      entries: response.buckets.map((entry) => ({
        id: `${this.getIdentifier()}_${entry.key}`,
        label: entry.key,
        count: entry.doc_count
      }))
    }
  }
}

export default RangeFacet
