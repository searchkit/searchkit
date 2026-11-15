import type {
  SearchRequest as ElasticsearchSearchRequest,
  QueryDslQueryContainer as ElasticsearchQueryDslQuery,
  SearchResponseBody as ElasticsearchBaseResponseBody,
  SearchHit as ElasticsearchBaseHit,
  AggregationsAggregationContainer,
  KnnQuery as ElasticKnnSearchQuery,
  MappingRuntimeFieldType
} from '@elastic/elasticsearch/lib/api/types'
import type { QueryRuleActions } from './queryRules'

type ElasticsearchHitDocument = Record<string, unknown>
type ElasticsearchHit = ElasticsearchBaseHit<ElasticsearchHitDocument>

type ElasticsearchResponseBody = ElasticsearchBaseResponseBody<ElasticsearchHitDocument>

type ElasticsearchQuery = ElasticsearchQueryDslQuery
type ElasticsearchAggregation = AggregationsAggregationContainer
type KnnSearchQuery = ElasticKnnSearchQuery

type Filters = string | readonly string[] | ReadonlyArray<readonly string[] | string>

/**
 * @description The search parameters InstantSearch sends with each request.
 * Searchkit owns this type so its public types don't depend on `@algolia/client-search`.
 * It is structurally compatible with Algolia's v4 `SearchOptions`, and unknown keys are allowed.
 */
export interface SearchParams {
  readonly query?: string
  readonly page?: number
  readonly hitsPerPage?: number
  readonly facets?: readonly string[] | string
  readonly maxValuesPerFacet?: number
  readonly facetName?: string
  readonly facetQuery?: string
  readonly facetFilters?: Filters
  readonly numericFilters?: Filters
  readonly filters?: string
  readonly aroundLatLng?: string
  readonly aroundRadius?: number | 'all'
  readonly insideBoundingBox?: ReadonlyArray<readonly number[]> | string
  readonly attributesToRetrieve?: readonly string[]
  readonly attributesToHighlight?: readonly string[]
  readonly highlightPreTag?: string
  readonly highlightPostTag?: string
  readonly ruleContexts?: readonly string[]
  readonly [key: string]: unknown
}

/**
 * @description A single InstantSearch request, as passed to `handleInstantSearchRequests`.
 * Structurally compatible with Algolia's v4 `MultipleQueriesQuery`.
 */
export interface MultipleQueriesQuery {
  readonly indexName: string
  readonly type?: 'default' | 'facet'
  readonly facet?: string
  readonly params?: SearchParams
}

/**
 * @deprecated Use `MultipleQueriesQuery`. Kept as an alias for backwards compatibility.
 */
type AlgoliaMultipleQueriesQuery = MultipleQueriesQuery

export type FacetFieldConfig = {
  attribute: string
  field: string
  type: 'numeric' | 'string' | 'date'
  nestedPath?: string
}

export type FacetStringResponse = Record<string, number>

export type CustomFacetConfig = {
  field: string
  attribute: string
  type: 'numeric' | 'string' | 'date'
  nestedPath?: string
  /**
   * @description Allows you to customise the facet query that is sent to Elasticsearch. This is useful for custom facets that don't fit the standard terms aggregation.
   */
  facetQuery: (field: string, size: number, search: string) => ElasticsearchAggregation
  /**
   * @description Allows you to customise the filter query that is sent to Elasticsearch. This is useful for custom filters that don't fit the standard term query.
   */
  filterQuery: (field: string, value: string) => ElasticsearchQuery
  /**
   * @description Allows you to handle the facet response into a key value record of facet values and counts.
   */
  facetResponse: (aggregation: any) => FacetStringResponse
}

export type FilterAttribute = {
  attribute: string
  field: string
  type: 'numeric' | 'string' | 'date'
  /**
   * @description Supports documents with nested fields. This is the path to the nested field.
   */
  nestedPath?: string
  /**
   * @description Allows you to customise the filter query that is sent to Elasticsearch. This is useful for custom filters that don't fit the standard term query.
   */
  filterQuery?: (field: string, value: string) => ElasticsearchQuery
}

export interface BasicAuth {
  username: string
  password: string
}

export interface ConfigConnection {
  /**
   * @description The Elasticsearch host
   * @example http://localhost:9200
   */
  host?: string
  /**
   * @description The Elasticsearch API key. This is optional and only required if you have API key authentication enabled.
   * @example 1234567890
   */
  apiKey?: string
  /**
   * @description Headers to be sent with the Elasticsearch request.
   * @example { 'X-My-Header': 'My-Value' }
   */
  headers?: Record<string, string>
  /**
   * @description The Elasticsearch cloud id. This is optional and can be used to connect to Elasticsearch cloud. An alternative to host.
   */
  cloud_id?: string
  /**
   * @description The Elasticsearch account. This is optional and only required if you have basic authentication enabled.
   * @example username: elastic
   * @example password: changeme
   */
  auth?: BasicAuth

  withCredentials?: boolean
  /**
   * @description Set to true to send credentials with the request. This is useful for CORS requests.
   */
}

export interface SearchAttributeConfig {
  field: string
  weight?: number
}

export type FacetAttribute = string | FacetFieldConfig | CustomFacetConfig

export type SearchAttribute = string | SearchAttributeConfig

export type SortingOption = {
  /** The field to sort by */
  field: string
  /** Sort order: ascending or descending */
  order: 'asc' | 'desc'
  /** Path to nested field (e.g., 'marketplace' for marketplace.price) */
  nestedPath?: string
  /**
   * Mode for handling array values in sorting. Useful when sorting by fields that contain arrays.
   * - 'min': Use the minimum value from the array
   * - 'max': Use the maximum value from the array
   * - 'sum': Use the sum of all values in the array
   * - 'avg': Use the average of all values in the array
   * - 'median': Use the median value from the array
   */
  mode?: 'min' | 'max' | 'sum' | 'avg' | 'median'
}

export interface SearchSettingsConfig {
  /**
   * @description fields that will be searched when a user enters a query
   */
  search_attributes: SearchAttribute[]
  /**
   * @description fields that will be used to as facets
   */
  facet_attributes?: FacetAttribute[]
  /**
   * @description fields that will be used to as filters
   */
  filter_attributes?: FilterAttribute[]
  /**
   * @description fields that will be returned in the search results
   * @example ['name', 'price']
   **/
  result_attributes: string[]
  /**
   * @description fields that can be used to highlight search terms in the search results
   * @example ['name']
   **/
  highlight_attributes?: string[]
  /**
   * @description fields that can be used to generate a snippet of text matches from the search results
   * @example ['description']
   **/
  snippet_attributes?: string[]
  /**
   * @description Rules that can customise search results order.
   */
  query_rules?: QueryRule[]
  /**
   * @description Sorting options for the search. This is optional and will default to sorting by _score if not provided.
   * @example { 'price': { field: 'price', order: 'asc' } }
   * @example { 'price': [{ field: 'price', order: 'asc' }, { field: 'name', order: 'asc' }] }
   * @example { '_price_desc': { field: 'price', order: 'desc', nestedPath: 'marketplace' } }
   * @example { '_price_min': { field: 'price', order: 'asc', mode: 'min' } }
   * @example { '_price_max_nested': { field: 'price', order: 'desc', nestedPath: 'marketplace', mode: 'max' } }
   */
  sorting?: Record<string, SortingOption | SortingOption[]>
  /**
   * @description The fuzziness of the text search query. Defaults to AUTO:4,8
   */
  fuzziness?: string
  /**
   * @description The attribute that will be used for geo search. This is required if you want to use geo search. Must be am Elasticsearch geo_point type field.
   */
  geo_attribute?: string
  /**
   * @description Runtime mappings that will be applied to the search. This allows you to dynamically add fields to the search results that aren't in the index.
   */
  runtime_mappings?: Record<string, RuntimeMapping>
  /**
   * @description Semantic (vector) search, combined with the text query (replaces the `getKnnQuery` request option removed in v5).
   * @example { field: 'embedding', embed: async (query) => embedText(query), k: 50, mode: 'hybrid' }
   */
  semantic_search?: SemanticSearchConfig
}

export interface SemanticSearchConfig {
  /**
   * @description The vector field: a `dense_vector` field (Elasticsearch) or a vector column (Postgres)
   */
  field: string
  /**
   * @description Turns the query into a vector. Provide exactly one of `embed` or `model_id`.
   */
  embed?: (query: string) => Promise<number[]> | number[]
  /**
   * @description Elasticsearch only: the id of a deployed text embedding model, so Elasticsearch embeds the query itself (`knn.query_vector_builder.text_embedding`). Provide exactly one of `embed` or `model_id`.
   */
  model_id?: string
  /**
   * @description Number of nearest neighbours to return. Defaults to 50
   */
  k?: number
  /**
   * @description Elasticsearch only: number of candidates per shard. Defaults to 2 * k
   */
  num_candidates?: number
  /**
   * @description Postgres only: the distance function. Defaults to 'cosine'
   */
  distance?: 'cosine' | 'l2' | 'inner_product'
  /**
   * @description 'hybrid' combines the text query and the vector search (reciprocal rank fusion), 'semantic_only' uses the vector search only, 'text_only' ignores the vector search. Defaults to 'hybrid'. With an empty query there is no vector search in any mode.
   */
  mode?: 'hybrid' | 'semantic_only' | 'text_only'
}

interface QueryStringRuleCondition {
  context: 'query'
  match_type: 'prefix' | 'contains' | 'exact'
  value: string
}

interface RuntimeMapping {
  type: MappingRuntimeFieldType
  script: {
    source: string
  }
}

interface ContextRuleCondition {
  context: 'context'
  value: string[]
}

interface FilterRuleCondition {
  context: 'filterPresent'
  values: {
    attribute: string
    value: string
  }[]
}

interface PinnedResultAction {
  action: 'PinnedResult'
  documentIds: string[]
}

interface QueryBoostAction {
  action: 'QueryBoost'
  query: string
  weight: number
}

interface FilterAction {
  action: 'QueryFilter'
  query: string
}

interface QueryRewriteAction {
  action: 'QueryRewrite'
  query: string
}

interface RenderUserDataAction {
  action: 'RenderUserData'
  userData: string
}

interface RenderFacetsOrderAction {
  action: 'RenderFacetsOrder'
  facetAttributesOrder: string[]
}

export type QueryRuleAction =
  | PinnedResultAction
  | QueryBoostAction
  | QueryRewriteAction
  | RenderUserDataAction
  | RenderFacetsOrderAction
  | FilterAction

export type QueryRuleCondition =
  | QueryStringRuleCondition
  | ContextRuleCondition
  | FilterRuleCondition

export interface QueryRule {
  id: string
  conditions: QueryRuleCondition[][]
  actions: QueryRuleAction[]
}

export interface SearchkitConfig {
  /**
   * @description The search engine adapter, e.g. `ElasticsearchAdapter({ host })`. Takes precedence over `connection`.
   */
  adapter?: SearchAdapter<any, any>
  /**
   * @description The Elasticsearch connection, or a custom Elasticsearch `Transporter` (an object with an `msearch` method). Shorthand for `adapter: ElasticsearchAdapter(connection)`; ignored when `adapter` is set.
   */
  connection?: ConfigConnection | Transporter
  search_settings: SearchSettingsConfig
}

/**
 * @description A request to the search engine. For Elasticsearch, `body` is the `_msearch` request body.
 */
export type SearchRequest<TBody = ElasticsearchSearchRequest> = {
  body: TBody
  request: AlgoliaMultipleQueriesQuery
  indexName: string
}

/**
 * @description The search settings passed to `getQuery`, along with the InstantSearch request being transformed (e.g. `config.request.indexName`)
 */
export type QueryConfig = SearchSettingsConfig & {
  request: AlgoliaMultipleQueriesQuery
}

export interface RequestOptions<TRequest = SearchRequest, TResponse = ElasticsearchResponseBody> {
  /**
   * @description Allows you to override the organic query
   * @param query The original query search terms
   * @param search_attributes The search attributes configured in the search settings
   * @param config The search settings, plus the InstantSearch `request` being transformed
   * @returns An Elasticsearch query object or an array of Elasticsearch query objects
   * @returns false if you want to skip the search query (for vector search only, prefer `semantic_search.mode: 'semantic_only'`)
   */

  getQuery?: (
    query: string,
    search_attributes: SearchAttribute[],
    config: QueryConfig
  ) => ElasticsearchQuery | ElasticsearchQuery[] | false
  /**
   * @description Allows you to add base filters to be applied to the search. This is useful for user / document level permissions
   * @returns An array of Elasticsearch query objects that will be wrapped in a bool filter query
   **/
  getBaseFilters?: () => ElasticsearchQuery[]

  /**
   * @description Hooks are escape hatches that allow you to modify the search requests to Elasticsearch and the responses back from Elasticsearch.
   **/
  hooks?: {
    /**
     * @description Allows you to modify the search requests before they are sent to Elasticsearch
     * @param requests An array of SearchRequest objects, each containing the body (elasticsearch query) and indexName of the request
     * @returns An array of modified SearchRequest objects, each containing the body (elasticsearch query) and indexName of the request
     */
    beforeSearch?: (requests: TRequest[]) => Promise<TRequest[]>
    /**
     * @description Allows you to modify the search responses before its transformed into an InstantSearch response
     * @param requests An array of SearchRequest objects, each containing the body (elasticsearch query) and indexName of the request
     * @param responses An array of Elasticsearch Response objects
     * @returns An array of modified Elasticsearch response objects
     */
    afterSearch?: (requests: TRequest[], responses: TResponse[]) => Promise<TResponse[]>
  }
}

export interface Transporter {
  config?: ConfigConnection
  msearch: (requests: SearchRequest[]) => Promise<ElasticsearchResponseBody[]>
}

export interface AppSettings {
  debug: boolean
  timeout?: number
}

/**
 * @description A hit in an InstantSearch response
 */
export type SearchHit = {
  objectID: string
  [key: string]: any
}

export type FacetsStats = Record<
  string,
  { min: number | null; max: number | null; avg: number | null; sum: number | null }
>

/**
 * @description The InstantSearch (Algolia shaped) response to a search request
 */
export interface SearchResponse {
  appliedRules?: string[]
  exhaustiveNbHits: boolean
  exhaustiveFacetsCount?: boolean
  exhaustiveTypo?: boolean
  exhaustive?: { facetsCount: boolean; nbHits: boolean; typo: boolean }
  hitsPerPage: number
  processingTimeMS?: number
  nbHits?: number
  page: number
  nbPages: number
  query: string
  renderingContent?: {
    facetOrdering: {
      facets: { order: string[] }
      values?: Record<string, { sortRemainingBy: 'count' }>
    }
  }
  facets?: Record<string, Record<string, number>>
  facets_stats?: FacetsStats
  hits: SearchHit[]
  index: string
  params: string
  userData?: unknown[]
}

/**
 * @description The InstantSearch (Algolia shaped) response to a search for facet values request
 */
export interface SearchForFacetValuesResponse {
  facetHits: { value: string; highlighted: string; count: number }[]
  exhaustiveFacetsCount: boolean
  processingTimeMS?: number
}

/**
 * @description A search engine adapter. Searchkit evaluates query rules, then for each InstantSearch
 * request calls `buildRequest`, runs the `beforeSearch` hook, `execute`, the `afterSearch` hook and
 * `transformResponse` (or `transformFacetValuesResponse` for a search for facet values request).
 */
export interface SearchAdapter<TRequest = unknown, TResponse = unknown> {
  /** 'elasticsearch' | 'postgres' | a custom name */
  readonly name: string
  /** Builds the engine request for one InstantSearch request. May be async, e.g. to embed the query for semantic search. */
  buildRequest(
    request: AlgoliaMultipleQueriesQuery,
    settings: SearchSettingsConfig,
    rules: QueryRuleActions,
    options?: RequestOptions
  ): TRequest | Promise<TRequest>
  /** Runs the requests (in one round trip where the engine allows) and returns one response per request, in order */
  execute(requests: TRequest[], settings: AppSettings): Promise<TResponse[]>
  transformResponse(
    response: TResponse,
    request: AlgoliaMultipleQueriesQuery,
    settings: SearchSettingsConfig,
    rules: QueryRuleActions
  ): SearchResponse
  transformFacetValuesResponse(
    response: TResponse,
    request: AlgoliaMultipleQueriesQuery
  ): SearchForFacetValuesResponse
}

export type {
  AlgoliaMultipleQueriesQuery,
  ElasticsearchSearchRequest,
  ElasticsearchResponseBody,
  ElasticsearchHit,
  ElasticsearchQuery,
  KnnSearchQuery
}
