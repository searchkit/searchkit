import Client from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Integration tests for sorting', () => {
  const config = {
    connection: {
      host: 'http://localhost:9200',
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
        },
        _price_desc: {
          field: 'price',
          order: 'desc',
          nestedPath: 'marketplace'
        },
        _multi_sort: [
          {
            field: '_score',
            order: 'desc'
          },
          {
            field: 'price',
            order: 'asc',
            nestedPath: 'marketplace'
          }
        ],
        _price_min: {
          field: 'price',
          order: 'asc',
          mode: 'min'
        },
        _price_max_nested: {
          field: 'price',
          order: 'desc',
          nestedPath: 'marketplace',
          mode: 'max'
        }
      }
    }
  }

  it('should sort on title', async () => {
    const client = new Client(config as unknown as any)
    nock('http://localhost:9200')
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
    const client = new Client(config as unknown as any)
    nock('http://localhost:9200')
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
    const client = new Client({
      ...config,
      search_settings: {
        ...config.search_settings,
        sorting: {}
      }
    } as unknown as any)
    nock('http://localhost:9200')
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

  it('should sort on nested field with nestedPath', async () => {
    const client = new Client(config as unknown as any)
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.sort).toMatchInlineSnapshot(`
          {
            "marketplace.price": {
              "nested": {
                "path": "marketplace",
              },
              "order": "desc",
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((r) => {
        return {
          ...r,
          indexName: 'imdb_movies_price_desc'
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toBeTruthy()
  })

  it('should sort on multiple fields with mixed nested and non-nested', async () => {
    const client = new Client(config as unknown as any)
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.sort).toMatchInlineSnapshot(`
          [
            {
              "_score": "desc",
            },
            {
              "marketplace.price": {
                "nested": {
                  "path": "marketplace",
                },
                "order": "asc",
              },
            },
          ]
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((r) => {
        return {
          ...r,
          indexName: 'imdb_movies_multi_sort'
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toBeTruthy()
  })

  it('should sort with mode parameter for non-nested field', async () => {
    const client = new Client(config as unknown as any)
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.sort).toMatchInlineSnapshot(`
          {
            "price": {
              "mode": "min",
              "order": "asc",
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((r) => {
        return {
          ...r,
          indexName: 'imdb_movies_price_min'
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toBeTruthy()
  })

  it('should sort with mode parameter for nested field', async () => {
    const client = new Client(config as unknown as any)
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.sort).toMatchInlineSnapshot(`
          {
            "marketplace.price": {
              "mode": "max",
              "nested": {
                "path": "marketplace",
              },
              "order": "desc",
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((r) => {
        return {
          ...r,
          indexName: 'imdb_movies_price_max_nested'
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toBeTruthy()
  })
})
