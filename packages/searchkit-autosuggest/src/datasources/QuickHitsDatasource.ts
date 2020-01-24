import { MultiMatchQuery, TopHitsMetric, FilterBucket, SearchkitManager } from 'searchkit'

import map from 'lodash/map'
import get from 'lodash/get'
import defaults from 'lodash/defaults'
import { SearchkitDatasource } from './Types'

export type QuickHitsDatasourceOptions = {
  title: string
  id: string
  searchFields: Array<string>
  sourceFields: Array<string>
  size: number
  onSelect: Function
  itemRenderer?: Function
}
export class QuickHitsDatasource implements SearchkitDatasource {
  options: QuickHitsDatasourceOptions
  searchkit: SearchkitManager
  constructor(options) {
    this.options = defaults(options, {
      size: 3
    })
  }
  isSearchkitSource() {
    return true
  }

  configure(searchkit) {
    this.searchkit = searchkit
  }

  search(query, queryString) {
    return query.setAggs(
      FilterBucket(
        this.options.id,
        MultiMatchQuery(queryString, {
          type: 'phrase_prefix',
          fields: this.options.searchFields
        }),
        TopHitsMetric('tophits', {
          size: this.options.size,
          _source: this.options.searchFields
        })
      )
    )
  }

  getGroupedResult(results) {
    const path = ['aggregations', this.options.id, 'tophits', 'hits', 'hits']
    const items = map(get(results, path, []), (item: any) => {
      const result: Record<string, any> = {
        key: item._source.title,
        select: () => this.options.onSelect(item)
      }
      if (this.options.itemRenderer) {
        result.render = () => this.options.itemRenderer(item)
      }
      return result
    })
    return {
      title: this.options.title,
      results: items
    }
  }
}
