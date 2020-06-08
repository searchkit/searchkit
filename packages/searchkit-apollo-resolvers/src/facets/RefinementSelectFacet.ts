import { FilterSet } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface RefinementSelectFacetConfig {
  id: string
  field: string
  label: string
  size?: number
}

class RefinementSelectFacet implements BaseFacet {
  public TYPE = 'RefinementSelectFacet'
  public SELECTOR = 'AND'

  constructor(private config: RefinementSelectFacetConfig) {}

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

  getLabel(): string {
    return this.config.label
  }

  getId() {
    return this.config.id
  }

  getFilter(filter: FilterSet) {
    return {
      bool: {
        must: filter.selected.map((term) => ({ term: { [this.config.field]: term } }))
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
}

export default RefinementSelectFacet
