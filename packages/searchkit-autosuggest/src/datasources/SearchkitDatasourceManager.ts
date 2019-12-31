import { ImmutableQuery, SearchkitManager, ESTransport } from 'searchkit'

import reduce from 'lodash/reduce'
import map from 'lodash/map'
import filter from 'lodash/filter'
import { SuggestGroup, DataSource } from './Types'

export class SearchkitDatasourceManager implements DataSource {
  searchkit: SearchkitManager
  transport: ESTransport
  sources: Array<any>
  results: Record<string, any>
  constructor(searchkit) {
    this.searchkit = searchkit
    this.transport = searchkit.transport
    this.sources = []
  }

  isSearchkitSource() {
    return true
  }

  addSource(source) {
    source.configure(this.searchkit)
    this.sources.push(source)
  }

  async search(query = '') {
    const sharedQuery = new ImmutableQuery().setSize(0)
    const searchQuery = reduce(
      this.sources,
      (searchQuery, source) => source.search(searchQuery, query),
      sharedQuery
    )
    this.results = await this.transport.search(searchQuery.getJSON())
    return this.getGroupedResults()
  }

  getGroupedResults(): Array<SuggestGroup> {
    let results = map(this.sources, (source) => source.getGroupedResult(this.results))
    results = filter(results, (item) => item.results.length > 0)
    return results
  }
}
