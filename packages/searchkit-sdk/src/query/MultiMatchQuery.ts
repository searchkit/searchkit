import QueryManager from '../core/QueryManager'
import BaseQuery from './BaseQuery'

interface MultiMatchQueryConfig {
  fields: string[]
}

class MultiMatchQuery implements BaseQuery {
  constructor(private config: MultiMatchQueryConfig) {}

  getFilter(queryManager: QueryManager) {
    if (queryManager.hasQuery()) {
      return {
        bool: {
          should: [
            {
              multi_match: {
                query: queryManager.getQuery(),
                fields: this.config.fields,
                type: 'best_fields',
                operator: 'and'
              }
            },
            {
              multi_match: {
                query: queryManager.getQuery(),
                fields: this.config.fields,
                type: 'cross_fields'
              }
            },
            {
              multi_match: {
                query: queryManager.getQuery(),
                fields: this.config.fields,
                type: 'phrase'
              }
            },
            {
              multi_match: {
                query: queryManager.getQuery(),
                fields: this.config.fields,
                type: 'phrase_prefix'
              }
            }
          ]
        }
      }
    }
    return null
  }
}

export default MultiMatchQuery
