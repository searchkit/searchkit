import QueryManager from '../core/QueryManager'
import { Query } from '../core/RequestBodyBuilder'
import BaseQuery from './BaseQuery'

interface PrefixQueryOptions {
  fields: string[]
}

export default class PrefixQuery implements BaseQuery {
  private fields: string[]

  constructor(options: PrefixQueryOptions) {
    this.fields = options.fields
  }

  getFilter(queryManager: QueryManager): Query {
    return {
      bool: {
        must: [
          {
            multi_match: {
              query: queryManager.getQuery(),
              type: 'bool_prefix',
              fields: this.fields
            }
          }
        ]
      }
    }
  }
}
