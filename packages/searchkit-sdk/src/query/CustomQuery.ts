import QueryManager from '../core/QueryManager'
import type { Query } from '../core/RequestBodyBuilder'
import BaseQuery from './BaseQuery'

interface CustomQueryConfig {
  queryFn(query: string, queryManager?: QueryManager): Query | null
}

class CustomQuery implements BaseQuery {
  constructor(private config: CustomQueryConfig) {}

  getFilter(queryManager: QueryManager) {
    return this.config.queryFn(queryManager.getQuery(), queryManager)
  }
}

export default CustomQuery
