import { RequestBody } from '@elastic/elasticsearch/lib/Transport'
import QueryManager, { MixedFilter } from '../core/QueryManager'
import SearchkitRequest from '../core/SearchkitRequest'
import BaseQuery from '../query/BaseQuery'
import { BaseFacet } from '../facets/BaseFacet'
import { BaseFilter } from '../filters/BaseFilter'
import { VisibleWhenRuleSet } from '../facets'

export interface SortingOption {
  id: string
  label: string
  field: any
  defaultOption?: boolean
}

export interface CustomHighlightConfig {
  field: string
  config: any
}

export interface SearchkitConfig {
  host: string
  index: string
  sortOptions?: SortingOption[]
  hits: {
    fields: string[]
    highlightedFields?: (string | CustomHighlightConfig)[]
  }
  query?: BaseQuery
  facets?: Array<BaseFacet | VisibleWhenRuleSet>
  filters?: Array<BaseFilter>
  postProcessRequest?: (body: RequestBody) => RequestBody
}

export interface ResultsResolverParameters {
  filters: Array<MixedFilter>
  query: string
}

const getFacets = (
  facets: Array<BaseFacet | VisibleWhenRuleSet> = [],
  queryManager: QueryManager,
  ctx
) =>
  facets.reduce((facetsList, facet) => {
    if (facet instanceof VisibleWhenRuleSet) {
      return [...facetsList, ...facet.getActiveFacets(queryManager, ctx)]
    }
    return [...facetsList, facet]
  }, [])

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
    const queryOptions = parameters.queryOptions || { fields: [] }
    const queryManager = new QueryManager(parameters.filters, parameters.query, queryOptions)
    const facets = getFacets(skConfig.facets, queryManager, ctx)
    const skRequest = new SearchkitRequest(queryManager, skConfig, baseFilters, facets)

    return {
      searchkit: {
        skRequest: skRequest,
        queryManager: queryManager,
        facets,
        config: skConfig,
        hitType: ctx.searchkit.hitTypeMappings[returnTypeName]
      }
    }
  } catch (e) {
    throw e
  }
}
