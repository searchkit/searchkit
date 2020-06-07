import QueryManager from '../core/QueryManager'

interface BaseQuery {
  getFilter(queryManager: QueryManager): any
}

export default BaseQuery
