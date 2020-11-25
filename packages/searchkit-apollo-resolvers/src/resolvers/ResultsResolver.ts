import QueryManager, { MixedFilter } from '../core/QueryManager'
import SearchkitRequest from '../core/SearchkitRequest'
import BaseQuery from '../query/BaseQuery'
import { BaseFacet } from '../facets/BaseFacet'

export interface SortingOption {
  id: string
  label: string
  field: any
  defaultOption: boolean
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
    const skConfig = {
      sortOptions: [],
      ...config
    }
    const queryManager = new QueryManager(parameters.filters, parameters.query)
    const skRequest = new SearchkitRequest(queryManager, skConfig)

    ctx.searchkit = {
      skRequest: skRequest,
      queryManager: queryManager,
      config: skConfig
    }

    return {}
  } catch (e) {
    console.log(e)
  }
}
