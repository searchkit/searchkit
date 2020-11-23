import QueryManager, { MixedFilter } from '../core/QueryManager'
import SearchkitRequest from '../core/SearchkitRequest'
import BaseQuery from '../query/BaseQuery'
import { BaseFacet } from '../facets/BaseFacet'

export interface SortingOption {
  id: string
  label: string
  field: any
}

export interface SearchkitConfig {
  host: string
  index: string
  sortOptions?: SortingOption[]
  hits: {
    fields: string[]
  }
  query?: BaseQuery
  facets?: Array<BaseFacet>
}

export interface ResultsResolverParameters {
  filters: Array<MixedFilter>
  query: string
}

export default (config: SearchkitConfig) => async (parent, parameters, ctx) => {
  try {
    const queryManager = new QueryManager(parameters.filters, parameters.query)
    const skRequest = new SearchkitRequest(queryManager, config)

    ctx.skRequest = skRequest
    ctx.queryManager = queryManager
    ctx.config = config

    return {}
  } catch (e) {
    console.log(e)
  }
}
