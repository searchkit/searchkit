import Client from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Integration tests for sorting', () => {
  const config = {
    connection: {
      host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
      apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
    },
    search_settings: {
      search_attributes: ['title', 'actors', 'query'],
      result_attributes: ['title', 'actors', 'query'],
      facet_attributes: [
        'type',
        { field: 'actors.keyword', attribute: 'actors', type: 'string' },
        'rated'
      ],
      sorting: {
        default: {
          field: '_score',
          order: 'asc'
        },
        _by_title: {
          field: 'title.keyword',
          order: 'asc'
        }
      }
    }
  }

  it('should sort on title', async () => {
    const client = Client(config as unknown as any)
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.sort).toMatchInlineSnapshot(`
          {
            "title.keyword": "asc",
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((r) => {
        return {
          ...r,
          indexName: 'imdb_movies_by_title'
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toBeTruthy()
  })

  it('should sort on default', async () => {
    const client = Client(config as unknown as any)
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.sort).toMatchInlineSnapshot(`
          {
            "_score": "asc",
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((r) => {
        return {
          ...r
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toBeTruthy()
  })

  it('should have no sort without default and no override', async () => {
    const client = Client({
      ...config,
      search_settings: {
        ...config.search_settings,
        sorting: {}
      }
    } as unknown as any)
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x).not.toHaveProperty('sort')
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((r) => {
        return {
          ...r
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toBeTruthy()
  })
})
