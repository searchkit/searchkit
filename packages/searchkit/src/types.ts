import type { MultipleQueriesQuery as AlgoliaMultipleQueriesQuery } from '@algolia/client-search'
import type {
  SearchRequest as ElasticsearchSearchRequest,
  QueryDslQueryContainer as ElasticsearchQueryDslQuery,
  SearchResponseBody as ElasticsearchBaseResponseBody,
  SearchHit as ElasticsearchBaseHit
} from '@elastic/elasticsearch/lib/api/types'

type ElasticsearchHitDocument = Record<string, unknown>
type ElasticsearchHit = ElasticsearchBaseHit<ElasticsearchHitDocument>

type ElasticsearchResponseBody = ElasticsearchBaseResponseBody<ElasticsearchHitDocument>

type ElasticsearchQuery = ElasticsearchQueryDslQuery

export type MultipleQueriesQuery = AlgoliaMultipleQueriesQuery

export type FacetFieldConfig = {
  attribute: string
  field: string
  type: 'numeric' | 'string' | 'date'
  nestedPath?: string
}

export type FilterAttribute = {
  attribute: string
  field: string
  type: 'numeric' | 'string' | 'date'
  nestedPath?: string
}

export interface BasicAuth {
  username: string
  password: string
}

export interface ConfigConnection {
  /**
   * @description The Elasticsearch host
   * @example https://my-elasticsearch-host.com
   */
  host: string
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
   * @description The Elasticsearch account. This is optional and only required if you have basic authentication enabled.
   * @example username: elastic
   * @example password: changeme
   */
  auth?: BasicAuth
}

export interface SearchAttributeConfig {
  field: string
  weight?: number
}

export type FacetAttribute = string | FacetFieldConfig

export type SearchAttribute = string | SearchAttributeConfig

export type SortingOption = {
  field: string
  order: 'asc' | 'desc'
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
   */
  sorting?: Record<string, SortingOption | SortingOption[]>
  /**
   * @description The attribute that will be used for geo search. This is required if you want to use geo search. Must be am Elasticsearch geo_point type field.
   */
  geo_attribute?: string
}

interface QueryStringRuleCondition {
  context: 'query'
  match_type: 'prefix' | 'contains' | 'exact'
  value: string
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
  connection: ConfigConnection | Transporter
  search_settings: SearchSettingsConfig
}

export type SearchRequest = {
  body: ElasticsearchSearchRequest
  request: AlgoliaMultipleQueriesQuery
  indexName: string
}

export interface RequestOptions {
  /**
   * @description Allows you to override the organic query
   * @param query The original query search terms
   * @param search_attributes The search attributes configured in the search settings
   * @param config The search settings
   * @returns An Elasticsearch query object or an array of Elasticsearch query objects
   */
  getQuery?: (
    query: string,
    search_attributes: SearchAttribute[],
    config: SearchSettingsConfig
  ) => ElasticsearchQuery | ElasticsearchQuery[]
  /**
   * @description Allows you to add base filters to be applied to the search. This is useful for user / document level permissions
   * @returns An array of Elasticsearch query objects that will be wrapped in a bool filter query
   **/
  getBaseFilters?: () => ElasticsearchQuery[]
  hooks?: {
    /**
     * @description Allows you to modify the search requests before they are sent to Elasticsearch
     * @param requests An array of SearchRequest objects, each containing the body (elasticsearch query) and indexName of the request
     * @returns An array of modified SearchRequest objects, each containing the body (elasticsearch query) and indexName of the request
     */
    beforeSearch?: (requests: SearchRequest[]) => Promise<SearchRequest[]>
    /**
     * @description Allows you to modify the search responses before its transformed into an InstantSearch response
     * @param requests An array of SearchRequest objects, each containing the body (elasticsearch query) and indexName of the request
     * @param responses An array of Elasticsearch Response objects
     * @returns An array of modified Elasticsearch response objects
     */
    afterSearch?: (
      requests: SearchRequest[],
      responses: ElasticsearchResponseBody[]
    ) => Promise<ElasticsearchResponseBody[]>
  }
}

export interface Transporter {
  config?: ConfigConnection
  msearch: (requests: SearchRequest[]) => Promise<ElasticsearchResponseBody[]>
}

export interface AppSettings {
  debug: boolean
}

export type {
  AlgoliaMultipleQueriesQuery,
  ElasticsearchSearchRequest,
  ElasticsearchResponseBody,
  ElasticsearchHit,
  ElasticsearchQuery
}
