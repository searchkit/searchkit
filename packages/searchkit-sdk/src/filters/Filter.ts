import { isNil, isUndefined, omitBy } from 'lodash'
import { MixedFilter, ValueFilter } from '../core/QueryManager'
import { BaseFilter } from './BaseFilter'

interface FilterConfig {
  identifier: string
  field: string
  label: string
  display?: 'Filter' | string
}
class Filter implements BaseFilter {
  constructor(private config: FilterConfig) {}

  getIdentifier(): string {
    return this.config.identifier
  }

  getLabel(): string {
    return this.config.label
  }

  getFilters(filters: MixedFilter[]) {
    return {
      bool: {
        filter: filters.map((filter) => {
          if ('min' in filter || 'max' in filter) {
            const rangeFilter: { gte?: number; lte?: number } = {}
            if (!isUndefined(filter.min)) rangeFilter.gte = filter.min
            if (!isUndefined(filter.max)) rangeFilter.lte = filter.max
            return { range: { [this.config.field]: rangeFilter } }
          }

          if ('dateMin' in filter || 'dateMax' in filter) {
            const rangeFilter: { gte?: string; lte?: string } = {}
            if (!isUndefined(filter.dateMin)) rangeFilter.gte = filter.dateMin
            if (!isUndefined(filter.dateMax)) rangeFilter.lte = filter.dateMax
            return { range: { [this.config.field]: rangeFilter } }
          }

          if ('geoBoundingBox' in filter) {
            return {
              geo_bounding_box: {
                [this.config.field]: omitBy(
                  {
                    top_left: filter.geoBoundingBox.topLeft,
                    bottom_right: filter.geoBoundingBox.bottomRight,
                    bottom_left: filter.geoBoundingBox.bottomLeft,
                    top_right: filter.geoBoundingBox.topRight
                  },
                  isNil
                )
              }
            }
          }

          return { term: { [this.config.field]: (filter as ValueFilter).value } }
        })
      }
    }
  }

  getSelectedFilter(filter: MixedFilter) {
    if ('min' in filter || 'max' in filter) {
      return {
        identifier: this.getIdentifier(),
        id: `${this.getIdentifier()}_${filter.min}_${filter.max}`,
        label: this.getLabel(),
        display: this.config.display || 'RangeFilter',
        type: 'NumericRangeSelectedFilter',
        min: filter.min,
        max: filter.max
      }
    }

    if ('dateMin' in filter || 'dateMax' in filter) {
      return {
        identifier: this.getIdentifier(),
        id: `${this.getIdentifier()}_${filter.dateMin}_${filter.dateMax}`,
        label: this.getLabel(),
        display: this.config.display || 'RangeFilter',
        type: 'NumericRangeSelectedFilter',
        min: filter.dateMin,
        max: filter.dateMax
      }
    }

    if ('geoBoundingBox' in filter) {
      return {
        type: 'GeoBoundingBoxSelectedFilter',
        id: `${this.getIdentifier()}_${JSON.stringify(filter.geoBoundingBox)}`,
        identifier: this.getIdentifier(),
        label: this.getLabel(),
        topLeft: filter.geoBoundingBox.topLeft,
        bottomRight: filter.geoBoundingBox.bottomRight,
        display: this.config.display || 'GeoBoundingBoxFilter'
      }
    }

    if ('value' in filter) {
      return {
        type: 'ValueSelectedFilter',
        id: `${this.getIdentifier()}_${filter.value}`,
        identifier: this.getIdentifier(),
        label: this.config.label,
        value: filter.value,
        display: this.config.display || 'TermFilter'
      }
    }
  }
}

export default Filter
