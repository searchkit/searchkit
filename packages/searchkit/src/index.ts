import type {
  MultipleQueriesQuery as AlgoliaMultipleQueriesQuery,
  RequestOptions,
  AppSettings,
  SearchAdapter,
  SearchResponse,
  SearchForFacetValuesResponse,
  QueryRuleActions
} from '@searchkit/core'
import { getQueryRulesActionsFromRequest } from '@searchkit/core'
import { ElasticsearchAdapter } from '@searchkit/adapter-elasticsearch'
import type { SearchkitConfig } from './types'

export {
  ElasticsearchAdapter,
  ESTransporter,
  RelevanceQueryMatch,
  MatchFilter,
  TermFilter
} from '@searchkit/adapter-elasticsearch'
export type { ElasticsearchAdapterConnection } from '@searchkit/adapter-elasticsearch'
export type { SearchkitConfig } from './types'
// The engine-neutral types and helpers live in @searchkit/core; searchkit re-exports its public API.
export type {
  AlgoliaMultipleQueriesQuery,
  AppSettings,
  BasicAuth,
  ConfigConnection,
  CustomFacetConfig,
  ElasticsearchHit,
  ElasticsearchQuery,
  ElasticsearchResponseBody,
  ElasticsearchSearchRequest,
  FacetAttribute,
  FacetFieldConfig,
  FacetStringResponse,
  FacetValueOrder,
  FacetsStats,
  FilterAttribute,
  KnnSearchQuery,
  MultipleQueriesQuery,
  QueryConfig,
  QueryRule,
  QueryRuleAction,
  QueryRuleCondition,
  RequestOptions,
  SearchAdapter,
  SearchAttribute,
  SearchAttributeConfig,
  SearchForFacetValuesResponse,
  SearchHit,
  SearchParams,
  SearchRequest,
  SearchResponse,
  SearchSettingsConfig,
  SemanticSearchConfig,
  SortingOption,
  Transporter,
  FilterAndNode,
  FilterEqNode,
  FilterExistsNode,
  FilterGeoBoundingBoxNode,
  FilterGeoDistanceNode,
  FilterInNode,
  FilterNode,
  FilterNotNode,
  FilterOrNode,
  FilterRangeBounds,
  FilterRangeNode,
  QueryRuleActions,
  QueryRuleBoost
} from '@searchkit/core'
export { parseFilters, FilterParseError, getFilterAst, getFacetFilterMap } from '@searchkit/core'

/**
 * Picks the adapter for a Searchkit config: `adapter` wins; otherwise `connection` (an
 * Elasticsearch connection or a custom `Transporter`) is wrapped in `ElasticsearchAdapter`.
 */
const resolveAdapter = (config: SearchkitConfig): SearchAdapter<any, any> => {
  if (config.adapter) {
    return config.adapter
  }
  if (config.connection) {
    return ElasticsearchAdapter(config.connection)
  }
  throw new Error(
    'No adapter or connection provided. Pass `adapter` (e.g. `ElasticsearchAdapter({ host })`) or an Elasticsearch `connection` in the Searchkit configuration.'
  )
}

export default class Searchkit {
  private adapter: SearchAdapter<any, any>

  constructor(private config: SearchkitConfig, private settings: AppSettings = { debug: false }) {
    this.adapter = resolveAdapter(config)
  }

  async handleInstantSearchRequests(
    instantsearchRequests: readonly AlgoliaMultipleQueriesQuery[],
    requestOptions?: RequestOptions
  ): Promise<{ results: (SearchResponse | SearchForFacetValuesResponse)[] }> {
    if (!instantsearchRequests || Array.isArray(instantsearchRequests) === false) {
      console.log({ instantsearchRequests })
      throw new Error(
        'No instantsearch requests provided. Check that the data you are providing from API request is correct. Likely you are not passing the request body correctly, its still a JSON string or the API is not a POST request.'
      )
    }

    const queryRules = this.config.search_settings.query_rules || []

    const requestQueryRuleActions: QueryRuleActions[] = instantsearchRequests.map((request) => {
      return getQueryRulesActionsFromRequest(queryRules, request, this.config.search_settings)
    })

    let searchRequests = await Promise.all(
      instantsearchRequests.map((request, i) =>
        this.adapter.buildRequest(
          request,
          this.config.search_settings,
          requestQueryRuleActions[i],
          requestOptions
        )
      )
    )

    // hooks are typed for Elasticsearch (the default adapter); other adapters pass their own request / response objects
    const hooks = requestOptions?.hooks as RequestOptions<any, any>['hooks']

    if (hooks?.beforeSearch) {
      searchRequests = await hooks.beforeSearch(searchRequests)
    }

    let searchResponses = await this.adapter.execute(searchRequests, this.settings)

    if (hooks?.afterSearch) {
      searchResponses = await hooks.afterSearch(searchRequests, searchResponses)
    }

    try {
      const instantsearchResponses = searchResponses.map((response, i) => {
        if (instantsearchRequests[i].params?.facetName) {
          return this.adapter.transformFacetValuesResponse(response, instantsearchRequests[i])
        }
        return this.adapter.transformResponse(
          response,
          instantsearchRequests[i],
          this.config.search_settings,
          requestQueryRuleActions[i]
        )
      })

      return {
        results: instantsearchResponses
      }
    } catch (err) {
      console.error(err)
      throw new Error(
        'Error transforming response. Check the afterSearch hook function is correct. Likely you are not returning the correct response object.'
      )
    }
  }
}
