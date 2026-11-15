import { getIndexName } from '@searchkit/core'
import type {
  AppSettings,
  ConfigConnection,
  ElasticsearchResponseBody,
  SearchAdapter,
  SearchRequest,
  Transporter
} from '@searchkit/core'
import { transformRequest } from './transformRequest'
import transformResponse, { transformFacetValuesResponse } from './transformResponse'
import { ESTransporter } from './Transporter'
import { assertNoGetKnnQuery, getQueryVector } from './semantic'
import { createElasticsearchQueryFromRequest } from './utils'

/**
 * An Elasticsearch connection (`host` or `cloud_id`, plus auth), or a custom `Transporter`
 * (an object with an `msearch` method).
 */
export type ElasticsearchAdapterConnection = ConfigConnection | Transporter

/**
 * The Elasticsearch adapter: turns InstantSearch requests into one `_msearch` request.
 *
 * @example API({ adapter: ElasticsearchAdapter({ host, apiKey }), search_settings })
 */
export function ElasticsearchAdapter(
  connection: ElasticsearchAdapterConnection
): SearchAdapter<SearchRequest, ElasticsearchResponseBody> {
  const getTransporter = (settings: AppSettings): Transporter =>
    'msearch' in connection ? connection : new ESTransporter(connection, settings)

  return {
    name: 'elasticsearch',

    async buildRequest(request, settings, rules, options) {
      assertNoGetKnnQuery(options)
      const queryVector = await getQueryVector(rules.query, settings)

      return {
        body: transformRequest(request, settings, rules, options, queryVector),
        request: request,
        indexName: getIndexName(request.indexName, settings)
      }
    },

    async execute(requests, settings) {
      if (settings.debug) {
        console.log('Performing search with requests:')
        console.log('POST /_msearch')
        console.log(createElasticsearchQueryFromRequest(requests))
      }
      return getTransporter(settings).msearch(requests)
    },

    transformResponse,

    transformFacetValuesResponse
  }
}
