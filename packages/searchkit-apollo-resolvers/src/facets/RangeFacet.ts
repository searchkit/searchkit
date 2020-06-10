import { RangeFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface RangeFacetConfig {
  id: string
  field: string
  label: string
  size?: number
  range: {
    min: number
    max: number
    interval: number
    min_doc_count?: number
  }
}

class RangeFacet implements BaseFacet {
  public TYPE = 'RangeFacet'
  public SELECTOR = 'OR'

  constructor(public config: RangeFacetConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getId() {
    return this.config.id
  }

  getFilter(filter: RangeFilter) {
    return { range: { [this.config.field]: { gte: filter.min, lte: filter.max } } }
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
      type: this.TYPE,
      entries: response.buckets.map((entry) => ({
        id: `${this.getId()}_${entry.key}`,
        label: entry.key,
        count: entry.doc_count
      }))
    }
  }
}

export default RangeFacet
