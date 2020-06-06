import QueryManager, { FilterSet } from "../core/QueryManager"
import SearchkitRequest from "../core/SearchkitRequest";

export interface SearchkitConfig {
  host: String
  hits: {
    fields: String[]
  }
}

export interface ResultsResolverParameters {
  filters: Array<FilterSet>
  query: String
}

export default (config: SearchkitConfig) => async (parent, parameters, ctx) => {
  const queryManager = new QueryManager(parameters.filters, parameters.query)
  const skRequest = new SearchkitRequest(queryManager)
  
  ctx.skRequest = skRequest

  return {}

}