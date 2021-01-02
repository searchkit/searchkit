import QueryManager, { MixedFilter } from '../core/QueryManager'
import SearchkitRequest from '../core/SearchkitRequest'
import BaseQuery from '../query/BaseQuery'
import { BaseFacet } from '../facets/BaseFacet'

export interface SortingOption {
  id: string
  label: string
  field: any
  defaultOption?: boolean
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

export default async (parent, parameters, ctx, info) => {
  try {
    const returnTypeName = info.returnType.name
    const config = ctx.searchkit.configs[returnTypeName]
    const skConfig = {
      sortOptions: [],
      ...config
    }
    const baseFilters = ctx.searchkit.baseFilters[returnTypeName]
      ? ctx.searchkit.baseFilters[returnTypeName](parent, parameters, ctx, info)
      : []
    const queryManager = new QueryManager(parameters.filters, parameters.query)
    const skRequest = new SearchkitRequest(queryManager, skConfig, baseFilters)

    return {
      searchkit: {
        skRequest: skRequest,
        queryManager: queryManager,
        config: skConfig,
        hitType: ctx.searchkit.hitTypeMappings[returnTypeName]
      }
    }
  } catch (e) {
    console.log(e)
  }
}
