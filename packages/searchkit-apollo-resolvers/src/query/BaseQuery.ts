import QueryManager from '../core/QueryManager'

interface BaseQuery {
  getFilter(queryManager: QueryManager): Record<string, unknown>
}

export default BaseQuery
