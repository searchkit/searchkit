import { ValueFilter } from '../core/QueryManager'
import { BaseFacet, FacetOptions } from './BaseFacet'
import { createRegexQuery } from './utils'

interface RefinementSelectFacetConfig {
  id: string
  field: string
  size?: number
  label: string
  display?: 'ListFacet' | 'ComboFacet' | string
  multipleSelect?: boolean
}

class RefinementSelectFacet implements BaseFacet {
  public excludeOwnFilters = false

  constructor(public config: RefinementSelectFacetConfig) {
    this.excludeOwnFilters = this.config.multipleSelect
  }
  getLabel(): string {
    return this.config.label
  }

  getId() {
    return this.config.id
  }

  getFilters(filters: Array<ValueFilter>) {
    const condition = this.excludeOwnFilters ? 'should' : 'must'
    return {
      bool: {
        [condition]: filters.map((term) => ({ term: { [this.config.field]: term.value } }))
      }
    }
  }

  getAggregation(overrides: FacetOptions) {
    return {
      [this.config.id]: {
        terms: {
          field: this.config.field,
          size: overrides?.size || this.config.size || 5,
          ...(overrides?.query ? { include: createRegexQuery(overrides.query) } : {})
        }
      }
    }
  }

  transformResponse(response: any) {
    return {
      id: this.getId(),
      label: this.getLabel(),
      display: this.config.display || 'ListFacet',
      type: 'RefinementSelectFacet',
      entries: response.buckets.map((entry) => ({
        id: `${this.getId()}_${entry.key}`,
        label: entry.key,
        count: entry.doc_count
      }))
    }
  }
}

export default RefinementSelectFacet
