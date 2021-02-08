import QueryManager from '../core/QueryManager'
import type { Query } from '../core/SearchkitRequest'

interface BaseQuery {
  getFilter(queryManager: QueryManager): Query
}

export default BaseQuery
