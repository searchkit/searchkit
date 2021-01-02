import QueryManager from '../core/QueryManager'

interface BaseQuery {
  getFilter(queryManager: QueryManager): Array<Record<string, unknown>>
}

export default BaseQuery
