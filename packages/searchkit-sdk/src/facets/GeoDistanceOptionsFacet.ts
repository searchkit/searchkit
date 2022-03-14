import { ValueFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface GeoDistanceOptionsFacetConfig {
  identifier: string
  field: string
  origin: string
  unit?: string
  label: string
  display?: string
  ranges: {
    from?: number
    to?: number
    label: string
  }[]
  multipleSelect?: boolean
}

class GeoDistanceOptionsFacet implements BaseFacet {
  public excludeOwnFilters = false
  private unit: string

  constructor(public config: GeoDistanceOptionsFacetConfig) {
    this.excludeOwnFilters = config.multipleSelect
    this.unit = config.unit || 'mi'
  }
  getLabel(): string {
    return this.config.label
  }

  getIdentifier(): string {
    return this.config.identifier
  }

  getFilters(filterValues: ValueFilter[]) {
    const condition = this.excludeOwnFilters ? 'should' : 'must'
    const filters = filterValues.map(({ value }) => {
      const range = this.config.ranges.find((option) => option.label === value)
      return range
    })
    return {
      bool: {
        [condition]: filters.map((range) => ({
          bool: {
            ...(range.from
              ? {
                  must_not: [
                    {
                      geo_distance: {
                        distance: range.from + this.config.unit,
                        [this.config.field]: this.config.origin
                      }
                    }
                  ]
                }
              : {}),
            ...(range.to
              ? {
                  must: [
                    {
                      geo_distance: {
                        distance: range.to + this.config.unit,
                        [this.config.field]: this.config.origin
                      }
                    }
                  ]
                }
              : {})
          }
        }))
      }
    }
  }

  getAggregation() {
    return {
      [this.getIdentifier()]: {
        geo_distance: {
          field: this.config.field,
          origin: this.config.origin,
          unit: this.unit,
          keyed: true,
          ranges: this.config.ranges.map((range) => ({
            from: range.from,
            to: range.to,
            key: range.label
          }))
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
      type: 'GeoDistanceOptionsFacet',
      value: filterSet.value
    }
  }

  transformResponse(response: any) {
    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      display: this.config.display || 'ListFacet',
      type: 'GeoDistanceOptionsFacet',
      entries: this.config.ranges.map((option) => {
        const docCount = response.buckets[option.label]?.doc_count || 0
        return {
          label: option.label,
          count: docCount
        }
      })
    }
  }
}

export default GeoDistanceOptionsFacet
