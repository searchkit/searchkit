import Client from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'
import {
  APIKeyNotAuthorized,
  ElasticsearchError,
  InvalidRequest,
  KeyUnauthorizedForIndex
} from '../mocks/ErrorElasticsearchResponses'

describe('Transport Errors', () => {
  const client = Client({
    connection: {
      host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
      apiKey: 'apikey'
    },
    search_settings: {
      highlight_attributes: ['title', 'actors'],
      search_attributes: ['title', 'actors', 'query'],
      result_attributes: ['title', 'actors', 'query'],
      facet_attributes: ['type'],
      query_rules: []
    }
  })

  it('401 error', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, APIKeyNotAuthorized)

    await expect(() => {
      return client.handleInstantSearchRequests(
        DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
      )
    }).rejects.toThrowErrorMatchingSnapshot()
  })

  it('403 error', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, KeyUnauthorizedForIndex)

    await expect(() => {
      return client.handleInstantSearchRequests(
        DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
      )
    }).rejects.toThrowErrorMatchingSnapshot()
  })

  it('400 error', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, InvalidRequest)

    await expect(() => {
      return client.handleInstantSearchRequests(
        DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
      )
    }).rejects.toThrowErrorMatchingSnapshot()
  })

  it('500 error', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, ElasticsearchError)

    await expect(() => {
      return client.handleInstantSearchRequests(
        DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
      )
    }).rejects.toThrowErrorMatchingSnapshot()
  })

  it('200 but bad response', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, {
        responses: [{ hits: [] }],
        status: 200
      })

    await expect(() => {
      return client.handleInstantSearchRequests(
        DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
      )
    }).rejects.toThrowErrorMatchingSnapshot()
  })
})
