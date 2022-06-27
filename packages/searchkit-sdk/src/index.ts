import type { SearchInnerHits, SearchRequest } from '@elastic/elasticsearch-types/lib/api/types'
import QueryManager, { MixedFilter, QueryOptions } from './core/QueryManager'
import RequestBodyBuilder from './core/RequestBodyBuilder'
import BaseQuery from './query/BaseQuery'
import { BaseFacet } from './facets/BaseFacet'
import { BaseFilter } from './filters/BaseFilter'
import { VisibleWhenRuleSet } from './facets'
import { SearchkitTransporter, FetchClientTransporter } from './transporters'
import { getAggregationsFromFacets } from './core/FacetsFns'
import {
  SearchkitResponseTransformer,
  ElasticSearchResponseTransformer,
  SearchkitResponse,
  SearchkitHit
} from './transformers'
import { BaseSuggestor } from './suggestors'

export * from './query'
export * from './facets'
export * from './filters'
export * from './transporters'
export * from './suggestors'
export { MixedFilter, QueryOptions, SearchkitResponse, SearchkitHit }

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

export interface CloudHost {
  id: string
}

export interface BaseConfig {
  host?: string
  cloud?: CloudHost
  index: string
  connectionOptions?: {
    apiKey?: string
    headers?: Record<string, string>
  }
}

export type CollapseInnerHitsConfig = SearchInnerHits

export interface CollapseConfig {
  field: string
  inner_hits?: CollapseInnerHitsConfig | CollapseInnerHitsConfig[]
}

export interface SearchkitConfig extends BaseConfig {
  suggestions?: Array<BaseSuggestor<any>>
  sortOptions?: SortingOption[]
  hits?: {
    fields: string[]
    highlightedFields?: (string | CustomHighlightConfig)[]
  }
  query?: BaseQuery
  facets?: Array<BaseFacet | VisibleWhenRuleSet>
  filters?: Array<BaseFilter>
  collapse?: CollapseConfig
  postProcessRequest?: (body: SearchRequest) => SearchRequest
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

const createInstance = (
  config: SearchkitConfig,
  transporter?: SearchkitTransporter
): SearchkitRequest => new SearchkitRequest(config, transporter)

export type ResponseRequest = {
  hits?: {
    size?: number
    from?: number
    includeRawHit?: boolean
  }
  facets?:
    | boolean
    | Array<{
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

export class SearchkitRequest {
  private queryManager: QueryManager
  private transporter: SearchkitTransporter
  private transformer: SearchkitResponseTransformer

  constructor(private config: SearchkitConfig, transporter?: SearchkitTransporter) {
    this.queryManager = new QueryManager()
    this.transporter = !transporter ? new FetchClientTransporter(config) : transporter
    this.transformer = new ElasticSearchResponseTransformer()
    this.handleDefaults()
  }

  handleDefaults(): void {
    const defaultSortOptionId =
      this.config.sortOptions && this.config.sortOptions.find((option) => option.defaultOption)
    const defaultSortOption =
      defaultSortOptionId && getSortOption(defaultSortOptionId.id, this.config.sortOptions)
    this.queryManager.setSortBy(defaultSortOption)
  }

  query(query: string): SearchkitRequest {
    this.queryManager.setQuery(query)
    return this
  }

  setFilters(filters: Array<MixedFilter>): SearchkitRequest {
    this.queryManager.setFilters(filters)
    return this
  }

  setQueryOptions(options: QueryOptions): SearchkitRequest {
    this.queryManager.setQueryOptions(options)
    return this
  }

  setSortBy(sortBy: string): SearchkitRequest {
    if (this.config.sortOptions && sortBy) {
      const sortOption = getSortOption(sortBy, this.config.sortOptions)
      this.queryManager.setSortBy(sortOption)
    }
    return this
  }

  async executeSuggestions(query: string): Promise<Array<any>> {
    const suggestions = await Promise.all(
      this.config.suggestions.map((suggestor) => suggestor.getSuggestions(query, this.transporter))
    )
    return suggestions
  }

  async execute(
    responseRequest: ResponseRequest,
    baseFilters: BaseFilters = []
  ): Promise<SearchkitResponse> {
    const partialQueries = []
    const facets = getFacets(this.config.facets, this.queryManager, {})
    let filteredFacets = null
    let overrides = {}

    if (!responseRequest.hits) responseRequest.hits = {}
    if (!responseRequest.hits.size) responseRequest.hits.size = 0
    if (!responseRequest.hits.from) responseRequest.hits.from = 0

    if (responseRequest.facets) {
      if (Array.isArray(responseRequest.facets)) {
        const filteredFacetIdentifiers = responseRequest.facets.map((facet) => facet.identifier)
        filteredFacets =
          facets &&
          facets.filter((facet) => filteredFacetIdentifiers.includes(facet.getIdentifier()))
        overrides = responseRequest.facets.reduce(
          (acc, facet) => ({
            ...acc,
            [facet.identifier]: {
              query: facet.query,
              size: facet.size
            }
          }),
          {}
        )
      }
      const aggs = getAggregationsFromFacets(this.queryManager, overrides, filteredFacets || facets)
      partialQueries.push(aggs)
    }

    const chosenSortOption = this.queryManager.getSortBy()

    partialQueries.push({
      size: responseRequest.hits.size,
      from: responseRequest.hits.from,
      sort: chosenSortOption ? chosenSortOption.field : [{ _score: 'desc' }]
    })

    let skRequestBody = RequestBodyBuilder(
      this.queryManager,
      this.config,
      baseFilters,
      facets,
      partialQueries
    )
    if (this.config.postProcessRequest) {
      skRequestBody = this.config.postProcessRequest(skRequestBody)
    }
    const response = await this.transporter.performRequest(skRequestBody)

    return this.transformer.transformResponse(
      response,
      filteredFacets || facets,
      this.queryManager,
      this.config,
      responseRequest
    )
  }
}

export default createInstance
