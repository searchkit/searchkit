import QueryManager from '../core/QueryManager'
import type { Query } from '../core/RequestBodyBuilder'

interface BaseQuery {
  getFilter(queryManager: QueryManager): Query | null
}

export default BaseQuery
