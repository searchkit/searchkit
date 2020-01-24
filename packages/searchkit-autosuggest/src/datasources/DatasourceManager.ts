import { SearchkitManager } from 'searchkit'

import each from 'lodash/each'
import flatten from 'lodash/flatten'
import { Source, DataSource, SuggestGroup } from './Types'
import { SearchkitDatasourceManager } from './SearchkitDatasourceManager'

export class DatasourceManager {
  searchkit: SearchkitManager
  sources: Array<DataSource>
  searchkitDatasource: SearchkitDatasourceManager

  constructor(searchkit, sources: Array<Source> = []) {
    this.searchkit = searchkit
    this.searchkitDatasource = new SearchkitDatasourceManager(searchkit)

    this.sources = []
    each(sources, (source) => {
      if (source.isSearchkitSource()) {
        this.searchkitDatasource.addSource(source)
      } else {
        this.sources.push(source as DataSource)
      }
    })
    this.sources.push(this.searchkitDatasource)
  }

  async search(query): Promise<Array<SuggestGroup>> {
    const results = await Promise.all(this.sources.map((source) => source.search(query)))
    return flatten(results)
  }
}
