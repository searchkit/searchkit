import _ from 'lodash'
import QueryManager, { HierarchicalValueFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface HierarchicalMenuFacetConfig {
  identifier: string
  fields: Array<string>
  label: string
  display?: 'HierarchicalMenu' | string
}

class HierarchicalMenuFacet implements BaseFacet {
  public excludeOwnFilters = false

  constructor(public config: HierarchicalMenuFacetConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getIdentifier() {
    return this.config.identifier
  }

  getFilters(filters: Array<HierarchicalValueFilter>) {
    return {
      bool: {
        must: filters.map((filter) => ({ term: { [this.config.fields[filter.level - 1]]: filter.value } }))
      }
    }
  }

  getAggregation(overrides, queryManager: QueryManager) {
    const appliedFilters =  queryManager.getFiltersById(this.config.identifier) as Array<HierarchicalValueFilter> || []
    const levelAggs = this.config.fields.reduce((aggs, field, index) => {
      const level = index + 1
      const parentFilters = appliedFilters.filter((f) => f.level < level)
      const getAggs = (parentFilters.length === (level - 1))
      if (getAggs) {
        return {
          ...aggs,
          [`lvl_${level}`]: {
            "filter": parentFilters.length === 0 ? { match_all: {} } : {
              "bool": {
                "must": parentFilters.map((f) => {
                  return {
                    "term": {
                      [this.config.fields[f.level-1]]: {
                        "value": f.value
                      }
                    }
                  }
                })
              },
            },
            aggs: {
              "aggs": {
                "terms": {
                  "field": this.config.fields[level-1]
                }
              }
            }
          }
        }
      } else {
        return aggs
      }
    }, {})

    return {
      [this.getIdentifier()]: {
        "filter": {
          "match_all": {}
        },
        "aggs": levelAggs
      }
    }
  }

  getSelectedFilter(filterSet) {
    return {
      type: 'HierarchicalMenuFilter',
      id: `${this.getIdentifier()}`,
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      value: filterSet.value,
      level: filterSet.level,
      display: this.config.display || 'HierarchicalMenuFacet'
    }
  }

  transformResponse(response, queryManager: QueryManager) {
    const appliedFilters = queryManager.getFiltersById(this.config.identifier) as Array<HierarchicalValueFilter> || []
    const buildEntries = (level: number) => {
      if (response[`lvl_${level}`]) {
        const levelFilter = appliedFilters.find((f) => f.level === level)
        return response[`lvl_${level}`].aggs.buckets.map((bucket) => {
          return {
            label: bucket.key,
            count: bucket.doc_count,
            id: `${this.getIdentifier()}_${bucket.key}_${level}`,
            entries: levelFilter?.value === bucket.key ? buildEntries(level + 1) : null
          }
        })
      } else {
        return null
      }
    }

    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      type: 'HierarchicalMenuFacet',
      display: this.config.display || 'HierarchicalMenuFacet',
      entries: buildEntries(1)
    }
  }
}

export default HierarchicalMenuFacet
