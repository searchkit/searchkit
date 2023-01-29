import Client from '../../'
import {
  DisjunctiveExampleRequest,
  nonDynamicFacetRequest,
  nonDynamicFacetRequestOneFilter,
  NumericFiltersExampleRequest
} from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import {
  HitsResponseWithFacetFilter,
  HitsResponseWithFacetFilterAndNumericFacet,
  HitsResponseWithFacetFilterAndNumericFacetAndNumericFilter,
  HitsWithNoQueryOrFiltersResponse
} from '../mocks/ElasticsearchResponses'

describe('Integration tests', () => {
  it('call with one filter and query applied', async () => {
    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        highlight_attributes: ['title', 'actors'],
        search_attributes: ['title', 'actors', 'query'],
        result_attributes: ['title', 'actors', 'query'],
        facet_attributes: [
          'type',
          { field: 'actors.keyword', attribute: 'actors', type: 'string' },
          'rated'
        ]
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })

  describe('facets', () => {
    it('non dynamic facets', async () => {
      const client = new Client({
        connection: {
          host: 'http://localhost:9200',
          apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
        },
        search_settings: {
          highlight_attributes: ['title', 'actors'],
          search_attributes: ['title', 'actors', 'query'],
          result_attributes: ['title', 'actors', 'query'],
          facet_attributes: [
            'type',
            { field: 'actors.keyword', attribute: 'actors', type: 'string' },
            'rated',
            { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' }
          ]
        }
      })

      nock('http://localhost:9200')
        .post('/_msearch', (requestBody: any) => {
          expect(requestBody).toMatchSnapshot('ES Request')
          return true
        })
        .reply(200, HitsWithNoQueryOrFiltersResponse)

      const response = await client.handleInstantSearchRequests(
        nonDynamicFacetRequest as AlgoliaMultipleQueriesQuery[]
      )

      expect(response).toMatchSnapshot()
    })

    it('non dynamic facets with one filter', async () => {
      const client = new Client({
        connection: {
          host: 'http://localhost:9200',
          apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
        },
        search_settings: {
          highlight_attributes: ['title', 'actors'],
          search_attributes: ['title', 'actors', 'query'],
          result_attributes: ['title', 'actors', 'query'],
          facet_attributes: [
            'type',
            { field: 'actors.keyword', attribute: 'actors', type: 'string' },
            'rated',
            { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' }
          ]
        }
      })

      nock('http://localhost:9200')
        .post('/_msearch', (requestBody: any) => {
          expect(requestBody).toMatchSnapshot('ES Request')
          return true
        })
        .reply(200, HitsWithNoQueryOrFiltersResponse)

      const response = await client.handleInstantSearchRequests(
        nonDynamicFacetRequestOneFilter as AlgoliaMultipleQueriesQuery[]
      )

      expect(response).toMatchSnapshot()
    })

    it('numeric facets', async () => {
      const client = new Client({
        connection: {
          host: 'http://localhost:9200',
          apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
        },
        search_settings: {
          highlight_attributes: ['title', 'actors'],
          search_attributes: ['title', 'actors'],
          result_attributes: ['title', 'actors'],
          facet_attributes: [
            'type',
            { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' }
          ]
        }
      })

      nock('http://localhost:9200')
        .post('/_msearch', (requestBody: any) => {
          expect(requestBody).toMatchSnapshot('ES Request')
          return true
        })
        .reply(200, HitsResponseWithFacetFilterAndNumericFacet)

      const response = await client.handleInstantSearchRequests(
        DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
      )

      expect(response).toMatchSnapshot()
    })

    it('numeric filters', async () => {
      const client = new Client({
        connection: {
          host: 'http://localhost:9200',
          apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
        },
        search_settings: {
          highlight_attributes: ['title', 'actors'],
          search_attributes: ['title', 'actors', 'query'],
          result_attributes: ['title', 'actors', 'query'],
          facet_attributes: [
            'type',
            { field: 'actors.keyword', attribute: 'actors', type: 'string' },
            'rated',
            { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' }
          ]
        }
      })

      nock('http://localhost:9200')
        .post('/_msearch', (requestBody: any) => {
          expect(requestBody).toMatchSnapshot('ES Request')
          return true
        })
        .reply(200, HitsResponseWithFacetFilterAndNumericFacetAndNumericFilter)

      const response = await client.handleInstantSearchRequests(
        NumericFiltersExampleRequest as AlgoliaMultipleQueriesQuery[]
      )

      expect(response).toMatchSnapshot()
    })
  })
})
