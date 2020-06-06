import QueryManager, { FilterSet } from '../core/QueryManager'
import SearchkitRequest from '../core/SearchkitRequest'

export interface SearchkitConfig {
  host: string
  hits: {
    fields: string[]
  }
}

export interface ResultsResolverParameters {
  filters: Array<FilterSet>
  query: string
}

export default (config: SearchkitConfig) => async (parent, parameters, ctx) => {
  const queryManager = new QueryManager(parameters.filters, parameters.query)
  const skRequest = new SearchkitRequest(queryManager)

  ctx.skRequest = skRequest

  return {}
}
