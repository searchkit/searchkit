import QueryManager from '../core/QueryManager'
import BaseQuery from './BaseQuery'

interface MultiMatchQueryConfig {
  fields: string[]
}

class MultiMatchQuery implements BaseQuery {
  constructor(private config: MultiMatchQueryConfig) {}

  getFilter(queryManager: QueryManager) {
    if (queryManager.hasQuery()) {
      return [
        {
          multi_match: {
            query: queryManager.getQuery(),
            fields: this.config.fields
          }
        }
      ]
    }
    return []
  }
}

export default MultiMatchQuery
