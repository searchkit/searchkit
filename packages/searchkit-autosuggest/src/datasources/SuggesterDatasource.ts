import { SearchkitManager } from 'searchkit'
import { SearchkitDatasource } from './Types'

export type SuggesterDatasourceOptions = {
  title: string
  field: string
}

export class SuggesterDatasource implements SearchkitDatasource {
  options: SuggesterDatasourceOptions
  searchkit: SearchkitManager

  constructor(options) {
    this.options = options
  }

  isSearchkitSource() {
    return true
  }

  configure(searchkit) {
    this.searchkit = searchkit
  }

  search(query, queryString) {
    return query.setSuggestions({
      suggest: {
        prefix: queryString,
        completion: {
          field: this.options.field
        }
      }
    })
  }

  getGroupedResult() {
    return {
      title: this.options.title,
      results: []
    }
  }
}
