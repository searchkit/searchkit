import { LevelState } from '../state'
import {
  TermQuery,
  TermsBucket,
  FilterBucket,
  BoolMust,
  NestedQuery,
  NestedBucket,
  MinMetric,
  DefaultNumberBuckets
} from '../query'
import { FilterBasedAccessor } from './FilterBasedAccessor'

const map = require('lodash/map')
const get = require('lodash/get')
const includes = require('lodash/includes')
const startsWith = require('lodash/startsWith')
const each = require('lodash/each')
const take = require('lodash/take')

export interface NestedFacetAccessorOptions {
  field: string
  id: string
  title: string
  size?: number
  orderKey?: string
  orderDirection?: string
  startLevel?: number
}

export class NestedFacetAccessor extends FilterBasedAccessor<LevelState> {
  state = new LevelState()
  options: any

  constructor(key, options: NestedFacetAccessorOptions) {
    super(key, options.id)
    this.options = options
  }

  onResetFilters() {
    this.resetState()
  }

  getBuckets(level) {
    const buckets: Array<any> = this.getAggregations(
      [this.key, 'children', 'lvl' + level, 'children', 'buckets'],
      []
    )
    return map(buckets, (item) => {
      item.key = String(item.key)
      return item
    })
  }

  buildSharedQuery(query) {
    const levelFilters = this.state.getValue()
    const lastIndex = levelFilters.length - 1
    const filterTerms = map(levelFilters, (filter, i) => {
      const value = filter[0]
      const isLeaf = i === lastIndex
      const subField = isLeaf ? '.value' : '.ancestors'
      return TermQuery(this.options.field + subField, value)
    })

    if (filterTerms.length > 0) {
      const leafFilter = get(levelFilters, [levelFilters.length - 1, 0], '')
      const parentOfleaf = get(
        levelFilters,
        [levelFilters.length - 2, 0],
        this.options.title || this.key
      )
      const selectedFilter = {
        id: this.key,
        name: this.translate(parentOfleaf),
        value: leafFilter,
        remove: () => {
          this.state = this.state.clear(levelFilters.length - 1)
        }
      }

      query = query
        .addFilter(this.uuid, NestedQuery(this.options.field, BoolMust(filterTerms)))
        .addSelectedFilter(selectedFilter)
    }
    return query
  }

  getTermAggs() {
    let subAggs = undefined
    let orderMetric = undefined
    if (this.options.orderKey) {
      const orderDirection = this.options.orderDirection || 'asc'
      const orderKey = this.options.orderKey
      if (includes(['_count', '_term'], orderKey)) {
        orderMetric = { [orderKey]: orderDirection }
      } else {
        if (startsWith(orderKey, this.options.field + '.')) {
          const subAggName = this.options.field + '_order'
          orderMetric = {
            [subAggName]: orderDirection
          }
          subAggs = MinMetric(subAggName, orderKey)
        }
      }
    }

    const valueField = this.options.field + '.value'
    const nBuckets = this.options.size || DefaultNumberBuckets

    return TermsBucket('children', valueField, { size: nBuckets, order: orderMetric }, subAggs)
  }

  buildOwnQuery(query) {
    const levelField = this.options.field + '.level'
    const ancestorsField = this.options.field + '.ancestors'
    const startLevel = this.options.startLevel || 1
    const termAggs = this.getTermAggs()
    const lvlAggs = []
    const addLevel = (level, ancestors = []) => {
      lvlAggs.push(
        FilterBucket(
          'lvl' + level,
          BoolMust([TermQuery(levelField, level + startLevel), ...ancestors]),
          termAggs
        )
      )
    }

    addLevel(0)

    const levels = this.state.getValue()
    each(levels, (_level, i) => {
      const ancestors = map(take(levels, i + 1), (level) => TermQuery(ancestorsField, level[0]))

      addLevel(i + 1, ancestors)
    })

    return query.setAggs(
      FilterBucket(
        this.key,
        query.getFiltersWithoutKeys(this.uuid),
        NestedBucket('children', this.options.field, ...lvlAggs)
      )
    )
  }
}
