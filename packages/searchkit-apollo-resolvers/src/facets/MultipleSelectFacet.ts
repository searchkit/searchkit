import { FilterSet } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface MultipleSelectFacetConfig {
  id: string
  field: string
  size?: number
  label: string
}

class MultipleSelectFacet implements BaseFacet {
  public TYPE = 'MultipleSelectFacet'
  public excludeOwnFilters = true

  constructor(public config: MultipleSelectFacetConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getId() {
    return this.config.id
  }

  getFilter(filter: FilterSet) {
    return {
      bool: {
        should: filter.selected.map((term) => ({ term: { [this.config.field]: term } }))
      }
    }
  }

  getAggregation() {
    return {
      [this.config.id]: {
        terms: {
          field: this.config.field,
          size: this.config.size || 5
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

export default MultipleSelectFacet
