import QueryManager from '../core/QueryManager'
import BaseQuery from './BaseQuery'

interface CustomQueryConfig {
  queryFn(query: string, queryManager?: QueryManager): Record<string, unknown>
}

class CustomQuery implements BaseQuery {
  constructor(private config: CustomQueryConfig) {}

  getFilter(queryManager: QueryManager) {
    return this.config.queryFn(queryManager.getQuery(), queryManager)
  }
}

export default CustomQuery
