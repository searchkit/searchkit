import { BaseFilter } from './BaseFilter'

interface TermFilterConfig {
  identifier: string
  field: string
  label: string
  display?: 'TermFilter' | string
}

class TermFilter implements BaseFilter {
  constructor(private config: TermFilterConfig) {}

  getIdentifier(): string {
    return this.config.identifier
  }

  getLabel(): string {
    return this.config.label
  }

  getFilters(filters) {
    return {
      bool: {
        filter: filters.map((filter) => ({ term: { [this.config.field]: filter.value } }))
      }
    }
  }

  getSelectedFilter(filterSet) {
    return {
      type: 'ValueSelectedFilter',
      id: `${this.getIdentifier()}_${filterSet.value}`,
      identifier: this.getIdentifier(),
      label: this.config.label,
      value: filterSet.value,
      display: this.config.display || 'TermFilter'
    }
  }
}

export default TermFilter
