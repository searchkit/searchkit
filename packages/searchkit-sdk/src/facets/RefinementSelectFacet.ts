import { ValueFilter } from '../core/QueryManager'
import { BaseFacet, FacetOptions } from './BaseFacet'
import { createRegexQuery } from './utils'

interface RefinementSelectFacetConfig {
  identifier: string
  field: string
  size?: number
  label: string
  display?: 'ListFacet' | 'ComboFacet' | string
  multipleSelect?: boolean
  order?: 'count' | 'value'
}

class RefinementSelectFacet implements BaseFacet {
  public excludeOwnFilters = false

  constructor(public config: RefinementSelectFacetConfig) {
    this.excludeOwnFilters = this.config.multipleSelect
  }
  getLabel(): string {
    return this.config.label
  }

  getIdentifier() {
    return this.config.identifier
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
    const orderMap = {
      count: { _count: 'desc' },
      value: { _key: 'asc' }
    }
    return {
      [this.getIdentifier()]: {
        terms: {
          field: this.config.field,
          size: overrides?.size || this.config.size || 5,
          ...(this.config.order ? { order: orderMap[this.config.order] } : {}),
          ...(overrides?.query ? { include: createRegexQuery(overrides.query) } : {})
        }
      }
    }
  }

  getSelectedFilter(filterSet) {
    return {
      identifier: this.getIdentifier(),
      id: `${this.getIdentifier()}_${filterSet.value}`,
      label: this.getLabel(),
      display: this.config.display || 'ListFacet',
      type: 'ValueSelectedFilter',
      value: filterSet.value
    }
  }

  transformResponse(response: any) {
    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      display: this.config.display || 'ListFacet',
      type: 'RefinementSelectFacet',
      entries: response.buckets.map((entry) => ({
        label: entry.key,
        count: entry.doc_count
      }))
    }
  }
}

export default RefinementSelectFacet
