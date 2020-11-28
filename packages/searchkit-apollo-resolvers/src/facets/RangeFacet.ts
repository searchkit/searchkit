import { RangeFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface RangeFacetConfig {
  id: string
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

  getId(): string {
    return this.config.id
  }

  getFilters(filters: Array<RangeFilter>) {
    return { range: { [this.config.field]: { gte: filters[0].min, lte: filters[0].max } } }
  }

  getAggregation() {
    return {
      [this.config.id]: {
        histogram: {
          field: this.config.field,
          interval: this.config.range.interval,
          min_doc_count: this.config.range.min_doc_count || 0,
          extended_bounds: { min: this.config.range.min, max: this.config.range.max }
        }
      }
    }
  }

  transformResponse(response: any) {
    return {
      id: this.getId(),
      label: this.getLabel(),
      display: this.config.display || 'RangeSliderFacet',
      type: 'RangeFacet',
      entries: response.buckets.map((entry) => ({
        id: `${this.getId()}_${entry.key}`,
        label: entry.key,
        count: entry.doc_count
      }))
    }
  }
}

export default RangeFacet
