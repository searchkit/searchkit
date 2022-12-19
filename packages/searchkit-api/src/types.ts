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

export interface ClientConfigConnection {
  host: string
  apiKey?: string
}

export type FacetAttribute = string | FacetFieldConfig

export interface SearchSettingsConfig {
  search_attributes: Array<string>
  facet_attributes?: FacetAttribute[]
  filter_attributes?: FilterAttribute[]
  result_attributes: string[]
  highlight_attributes?: string[]
  prefix_attributes?: string[]
  typo_tolerance_attributes?: string[]
  query_rules?: QueryRule[]
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

interface QueryAttributeBoostAction {
  action: 'QueryAttributeBoost'
  attribute: string
  value?: string
  boost: number
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
  | QueryAttributeBoostAction
  | QueryRewriteAction
  | RenderUserDataAction
  | RenderFacetsOrderAction

export type QueryRuleCondition =
  | QueryStringRuleCondition
  | ContextRuleCondition
  | FilterRuleCondition

export interface QueryRule {
  conditions: QueryRuleCondition[][]
  actions: QueryRuleAction[]
}

export interface ClientConfig {
  connection: ClientConfigConnection | Transporter
  search_settings: SearchSettingsConfig
}

export type SearchRequest = {
  body: ElasticsearchSearchRequest
  indexName: string
}

export interface RequestOptions {
  getQuery?: (
    query: string,
    search_attributes: string[],
    config: SearchSettingsConfig
  ) => ElasticsearchQuery | ElasticsearchQuery[] | undefined
  getBaseFilters?: () => ElasticsearchQuery[] | undefined
}

export interface Transporter {
  config?: ClientConfigConnection
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
