
import QueryManager, { MixedFilter } from './core/QueryManager'
import RequestBodyBuilder from './core/RequestBodyBuilder'
import BaseQuery from './query/BaseQuery'
import { BaseFacet } from './facets/BaseFacet'
import { BaseFilter } from './filters/BaseFilter'
import { VisibleWhenRuleSet } from './facets'
import { SearchkitAdapter, ESClientAdapter } from './adapters'
import { getAggregationsFromFacets } from './core/FacetsFns'
import { SearchkitResponseTransformer, ElasticSearchResponseTransformer } from './transformers'

export * from './query'
export * from './facets'
export * from './filters'

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
  postProcessRequest?: (body: any) => any
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


const createInstance = (config: SearchkitConfig) => {
  return new SearchkitRequest(config)
}

export type ResponseRequest = {
  hits?: {
    size?: number
    from?: number
  }
  facets?: boolean | Array<{
    identifier: string
    query?: string
    size?: number
  }>
}

export type BaseFilters = Array<any>

function getSortOption(id, sortOptions: SortingOption[]) {
  const selectedSortOption = sortOptions.find((sortOption) => sortOption.id === id)
  if (!selectedSortOption) {
    throw new Error(`Sort Option: sorting option ${id} not found`)
  }
  return selectedSortOption
}

class SearchkitRequest {
  private queryManager: QueryManager
  private adapter: SearchkitAdapter
  private transformer: SearchkitResponseTransformer

  constructor(private config: SearchkitConfig) {
    this.queryManager = new QueryManager()
    this.adapter = new ESClientAdapter(this.config)
    this.transformer = new ElasticSearchResponseTransformer()
  }

  query(query: string) {
    this.queryManager.setQuery(query)
    return this
  }

  setFilters(filters: Array<MixedFilter>) {
    this.queryManager.setFilters(filters)
    return this
  }

  setSortBy(sortBy: string) {
    const sortOption = getSortOption(sortBy, this.config.sortOptions)
    this.queryManager.setSortBy(sortOption)
    return this
  }

  async execute(responseRequest: ResponseRequest, baseFilters: BaseFilters = []) {

    const partialQueries = []
    let facets = []
    let filteredFacets = null
    let overrides = {}
    if (!!responseRequest.facets) {
      facets = getFacets(this.config.facets, this.queryManager, {})
      if (Array.isArray(responseRequest.facets)) {
        const filteredFacetIdentifiers = responseRequest.facets.map(facet => facet.identifier)
        filteredFacets =
    facets && facets.filter((facet) => filteredFacetIdentifiers.includes(facet.getIdentifier()))
        overrides = responseRequest.facets.reduce((acc, facet) => {
          return {
            ...acc,
            [facet.identifier]: {
              query: facet.query,
              size: facet.size
            }
          }
        },{})
      }
      const aggs = getAggregationsFromFacets(this.queryManager, overrides, filteredFacets || facets)
      partialQueries.push(aggs)
    }

    const chosenSortOption = this.queryManager.getSortBy()

    partialQueries.push({
      size: responseRequest.hits?.size || 0,
      from: responseRequest.hits?.from || 0,
      sort: chosenSortOption ? chosenSortOption.field : [{ _score: 'desc' }]

    })
    let skRequestBody = RequestBodyBuilder(this.queryManager, this.config, baseFilters, facets, partialQueries)
    if (this.config.postProcessRequest) {
      skRequestBody = this.config.postProcessRequest(skRequestBody)
    }
    const response = await this.adapter.performRequest(skRequestBody)

    return this.transformer.transformResponse(response, filteredFacets || facets, this.queryManager, this.config, responseRequest)
  }

}

export default createInstance
