import {
  NestedFacetAccessor,
  TopHitsMetric,
  BoolMust,
  NestedFacetAccessorOptions,
  FilterBucket,
  NestedQuery,
  NestedBucket,
  TermsBucket,
  LevelState,
  SearchkitManager
} from 'searchkit'

import get from 'lodash/get'
import last from 'lodash/last'
import { createRegexQuery } from '../Utils'
import { SearchkitDatasource } from './Types'

export type HierarchicalRefinementDatasourceOptions = {
  accessorId?: string
  onSelect?: Function
  itemRenderer?: Function
} & NestedFacetAccessorOptions

export class HierarchicalRefinementDatasource implements SearchkitDatasource {
  options: HierarchicalRefinementDatasourceOptions
  searchkit: SearchkitManager
  originalAccessor: NestedFacetAccessor
  delegateAccessor: NestedFacetAccessor

  constructor(options) {
    this.options = options
  }

  isSearchkitSource() {
    return true
  }

  configure(searchkit) {
    this.searchkit = searchkit
    if (this.options.accessorId) {
      const accessor = searchkit.accessors.statefulAccessors[this.options.accessorId]
      if (!accessor) {
        console.error(
          `Could not create facet filter datasource with accessorId=${this.options.accessorId}`
        )
      } else {
        this.originalAccessor = accessor
      }
    } else {
      const { id, field, startLevel, title } = this.options
      this.originalAccessor = new NestedFacetAccessor(id, {
        id,
        field,
        startLevel,
        title
      })
      this.searchkit.addAccessor(this.originalAccessor)
    }
    this.delegateAccessor = this.createDelegate(this.originalAccessor)
  }

  createDelegate(accessor) {
    const delegateAccessor = new NestedFacetAccessor(accessor.options.id, { ...accessor.options })
    delegateAccessor.uuid = accessor.options.id
    return delegateAccessor
  }

  search(query, queryString) {
    const { field, startLevel } = this.delegateAccessor.options
    const regexpQuery = {
      regexp: {
        [field + '.value']: createRegexQuery(queryString)
      }
    }
    return query.setAggs(
      FilterBucket(
        this.delegateAccessor.uuid,
        BoolMust([NestedQuery(field, regexpQuery)]),
        NestedBucket(
          'children',
          field,
          FilterBucket(
            'filtered',
            BoolMust([
              regexpQuery,
              {
                range: {
                  [field + '.level']: {
                    gte: startLevel
                  }
                }
              }
            ]),
            TermsBucket(
              'terms',
              field + '.value',
              {
                size: this.options.size
              },
              TopHitsMetric('hits', {
                _source: [field + '.ancestors', 'ancestors'],
                size: 1
              })
            )
          )
        )
      )
    )
  }

  onSelect(item) {
    const { startLevel } = this.delegateAccessor.options
    const levels = item.ancestors
      .slice(startLevel - 1)
      .concat(item._key)
      .map((key) => [key])
    if (this.options.onSelect) {
      this.options.onSelect(item, levels)
    } else {
      this.originalAccessor.state = new LevelState(levels)
      this.searchkit.performSearch()
    }
  }

  getGroupedResult(results) {
    const { field } = this.delegateAccessor.options

    let buckets = get(
      results,
      ['aggregations', this.delegateAccessor.uuid, 'children', 'filtered', 'terms', 'buckets'],
      []
    )
    buckets = buckets.map((item) => {
      item.select = () => {
        this.onSelect(item)
      }
      item.hitSource = get(item, `hits.hits.hits[0]._source`, {})
      item.ancestors =
        get(item.hitSource, `${field}.ancestors`, null) || item.hitSource.ancestors || []
      item._key = item.key
      if (item.ancestors.length > 1) {
        item.key += ' - ' + last(item.ancestors)
      }
      return item
    })
    return {
      title: this.delegateAccessor.options.title,
      results: buckets
    }
  }
}
