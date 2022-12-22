import type { MultipleQueriesQuery as AlgoliaMultipleQueriesQuery } from '@algolia/client-search'
import { transformRequest } from './transformRequest'
import transformResponse, { transformFacetValuesResponse } from './transformResponse'
import { ClientConfig, SearchRequest, RequestOptions, Transporter, AppSettings } from './types'
import { ESTransporter } from './Transporter'
import { getQueryRulesActionsFromRequest, QueryRuleActions } from './queryRules'
import { createElasticsearchQueryFromRequest } from './utils'
export * from './types'

class Client {
  transporter: Transporter

  constructor(private config: ClientConfig, private settings: AppSettings = { debug: false }) {
    this.transporter =
      'msearch' in config.connection ? config.connection : new ESTransporter(config.connection)
  }

  private async performSearch(requests: SearchRequest[]) {
    if (this.settings.debug) {
      console.log('Performing search with requests:')
      console.log('POST /_msearch')
      console.log(createElasticsearchQueryFromRequest(requests))
    }
    const responses = await this.transporter.msearch(requests)
    return responses
  }

  async handleRequest(body: any, requestOptions?: RequestOptions) {
    const instantsearchRequests = body as AlgoliaMultipleQueriesQuery[]

    const instantsearchResponses = this.handleInstantSearchRequests(
      instantsearchRequests,
      requestOptions
    )

    return instantsearchResponses
  }

  async handleInstantSearchRequests(
    instantsearchRequests: AlgoliaMultipleQueriesQuery[],
    requestOptions?: RequestOptions
  ) {
    const queryRules = this.config.search_settings.query_rules || []

    const requestQueryRuleActions: QueryRuleActions[] = instantsearchRequests.map((request) => {
      return getQueryRulesActionsFromRequest(queryRules, request)
    })

    let esRequests: SearchRequest[] = instantsearchRequests.map((request, i) => ({
      body: transformRequest(
        request,
        this.config.search_settings,
        requestQueryRuleActions[i],
        requestOptions
      ),
      request: request,
      indexName: request.indexName
    }))

    if (requestOptions?.hooks?.beforeSearch) {
      esRequests = await requestOptions.hooks.beforeSearch(esRequests)
    }

    let esResponses = await this.performSearch(esRequests)

    if (requestOptions?.hooks?.afterSearch) {
      esResponses = await requestOptions.hooks.afterSearch(esRequests, esResponses)
    }

    const instantsearchResponses = esResponses.map((response, i) => {
      // @ts-ignore
      if (instantsearchRequests[i].params?.facetName) {
        return transformFacetValuesResponse(response, instantsearchRequests[i])
      }
      return transformResponse(
        response,
        instantsearchRequests[i],
        this.config.search_settings,
        requestQueryRuleActions[i]
      )
    })

    return {
      results: instantsearchResponses
    }
  }
}

const createClient = (config: ClientConfig, settings?: AppSettings) => new Client(config, settings)

export default createClient
