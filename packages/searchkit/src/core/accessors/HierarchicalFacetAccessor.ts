import { LevelState } from '../state'
import { TermQuery, TermsBucket, FilterBucket, BoolShould } from '../query/'
import { FilterBasedAccessor } from './FilterBasedAccessor'
const map = require('lodash/map')
const each = require('lodash/each')
const compact = require('lodash/compact')
const take = require('lodash/take')
const omitBy = require('lodash/omitBy')
const isUndefined = require('lodash/isUndefined')

export interface HierarchicalFacetAccessorOptions {
  fields: Array<string>
  size: number
  id: string
  title: string
  orderKey?: string
  orderDirection?: string
}

export class HierarchicalFacetAccessor extends FilterBasedAccessor<LevelState> {
  state = new LevelState()
  options: any
  uuids: Array<string>

  constructor(key, options: HierarchicalFacetAccessorOptions) {
    super(key)
    this.options = options
    this.computeUuids()
  }

  computeUuids() {
    this.uuids = map(this.options.fields, (field) => this.uuid + field)
  }

  onResetFilters() {
    this.resetState()
  }

  getBuckets(level) {
    const field = this.options.fields[level]
    const buckets: Array<any> = this.getAggregations([this.options.id, field, field, 'buckets'], [])
    return map(buckets, (item) => {
      item.key = String(item.key)
      return item
    })
  }

  getOrder() {
    if (this.options.orderKey) {
      const orderDirection = this.options.orderDirection || 'asc'
      return { [this.options.orderKey]: orderDirection }
    }
  }

  buildSharedQuery(query) {
    each(this.options.fields, (field: string, i: number) => {
      const filters = this.state.getLevel(i)
      const parentFilter = this.state.getLevel(i - 1)
      const isLeaf = !this.state.levelHasFilters(i + 1)
      const filterTerms = map(filters, TermQuery.bind(null, field))

      if (filterTerms.length > 0) {
        query = query.addFilter(
          this.uuids[i],
          filterTerms.length > 1 ? BoolShould(filterTerms) : filterTerms[0]
        )
      }

      if (isLeaf) {
        const selectedFilters = map(filters, (filter) => ({
          id: this.options.id,
          name: this.translate(parentFilter[0]) || this.options.title || this.translate(field),
          value: this.translate(filter),
          remove: () => {
            this.state = this.state.remove(i, filter)
          }
        }))
        query = query.addSelectedFilters(selectedFilters)
      }
    })

    return query
  }

  buildOwnQuery(query) {
    const lvlAggs = compact(
      map(this.options.fields, (field: string, i: number) => {
        if (this.state.levelHasFilters(i - 1) || i == 0) {
          return FilterBucket(
            field,
            query.getFiltersWithKeys(take(this.uuids, i)),
            TermsBucket(
              field,
              field,
              omitBy(
                {
                  size: this.options.size,
                  order: this.getOrder()
                },
                isUndefined
              )
            )
          )
        }
      })
    )

    const aggs = FilterBucket(this.options.id, query.getFiltersWithoutKeys(this.uuids), ...lvlAggs)

    return query.setAggs(aggs)
  }
}
