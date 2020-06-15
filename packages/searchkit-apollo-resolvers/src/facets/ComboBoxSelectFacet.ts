import { MixedFilter, ValueFilter } from '../core/QueryManager'
import { BaseFacet, FacetOptions } from './BaseFacet'
import { createRegexQuery } from './utils'

interface ComboBoxSelectFacetConfig {
  id: string
  field: string
  label: string
  display?: 'Combo' | string
  multipleSelect?: boolean
}

class ComboBoxSelectFacet implements BaseFacet {
  public TYPE = 'ComboBoxSelectFacet'
  public excludeOwnFilters = false

  constructor(public config: ComboBoxSelectFacetConfig) {
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
    if (!overrides) {
      return {}
    }
    return {
      [this.config.id]: {
        terms: {
          field: this.config.field,
          size: overrides?.size || 10,
          ...(overrides?.query ? { include: createRegexQuery(overrides.query) } : {})
        }
      }
    }
  }

  transformResponse(response: any) {
    return {
      id: this.getId(),
      label: this.getLabel(),
      type: this.TYPE,
      display: this.config.display || 'List',
      entries:
        response?.buckets.map((entry) => ({
          id: `${this.getId()}_${entry.key}`,
          label: entry.key,
          count: entry.doc_count
        })) || []
    }
  }
}

export default ComboBoxSelectFacet
