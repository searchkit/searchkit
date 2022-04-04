import { ValueFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface MultiQueryOptionsFacetConfig {
  identifier: string
  field: string
  label: string
  display?: string
  options: {
    min?: number
    max?: number
    value?: string | number
    dateMin?: string
    dateMax?: string
    label: string
  }[]
  multipleSelect?: boolean
}

const filterClauseMapper = (field) => (option) => {
  if (option.min || option.max) {
    return {
      range: {
        [field]: {
          ...(option.min && { gte: option.min }),
          ...(option.max && { lte: option.max })
        }
      }
    }
  } else if (option.value) {
    return {
      term: {
        [field]: option.value
      }
    }
  } else if (option.dateMin || option.dateMax) {
    return {
      range: {
        [field]: {
          ...(option.dateMin && { gte: option.dateMin }),
          ...(option.dateMax && { lte: option.dateMax })
        }
      }
    }
  }
}

class MultiQueryOptionsFacet implements BaseFacet {
  public excludeOwnFilters = false

  constructor(public config: MultiQueryOptionsFacetConfig) {
    this.excludeOwnFilters = config.multipleSelect
  }
  getLabel(): string {
    return this.config.label
  }

  getIdentifier(): string {
    return this.config.identifier
  }

  getFilters(filterValues: ValueFilter[]) {
    const condition = this.excludeOwnFilters ? 'should' : 'must'
    const filters = filterValues
      .map((value) => this.config.options.find((option) => option.label === value.value))
      .filter((option) => !!option)
    return {
      bool: {
        [condition]: filters.map(filterClauseMapper(this.config.field))
      }
    }
  }

  getAggregation() {
    const filterClauses = this.config.options.map(filterClauseMapper(this.config.field))
    const filters = this.config.options.reduce((acc, option, i) => {
      acc[option.label] = filterClauses[i]
      return acc
    }, {})
    return {
      [this.getIdentifier()]: {
        filters: {
          filters: filters
        }
      }
    }
  }

  getSelectedFilter(filterSet: ValueFilter) {
    return {
      identifier: this.getIdentifier(),
      id: `${this.getIdentifier()}_${filterSet.value}`,
      label: this.getLabel(),
      display: this.config.display || 'ListFacet',
      type: 'MultiQueryOptionsFacet',
      value: filterSet.value
    }
  }

  transformResponse(response: any) {
    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      display: this.config.display || 'ListFacet',
      type: 'MultiQueryOptionsFacet',
      entries: this.config.options.map((option) => {
        const docCount = response.buckets[option.label]?.doc_count || 0
        return {
          label: option.label,
          count: docCount
        }
      })
    }
  }
}

export default MultiQueryOptionsFacet
