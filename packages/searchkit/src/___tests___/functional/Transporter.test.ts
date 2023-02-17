import { AlgoliaMultipleQueriesQuery, ElasticsearchResponseBody, Transporter } from '../../types'
import { nonDynamicFacetRequest } from '../mocks/AlgoliaRequests'
import Client from '../../'
import { HitsWithNoQueryOrFiltersResponse } from '../mocks/ElasticsearchResponses'

describe('Transporter', () => {
  it('should allow overriding the transporter', async () => {
    class MyCustomTransporter implements Transporter {
      constructor() {}
      async msearch() {
        return HitsWithNoQueryOrFiltersResponse.responses as ElasticsearchResponseBody[]
      }
    }

    const customTransporter = new MyCustomTransporter()

    jest.spyOn(customTransporter, 'msearch')

    const client = new Client({
      connection: customTransporter,
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

    const response = await client.handleInstantSearchRequests(
      nonDynamicFacetRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(customTransporter.msearch).toBeCalled()
    expect(response)
  })

  it('should allow custom headers', async () => {
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(HitsWithNoQueryOrFiltersResponse)
      })
    })

    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'apiKey',
        headers: {
          'X-Custom-Header': 'custom header value'
        }
      },
      search_settings: {
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

    await client.handleInstantSearchRequests(
      nonDynamicFacetRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect((global.fetch as jest.Mock).mock.calls[0][1].headers).toMatchInlineSnapshot(`
      {
        "X-Custom-Header": "custom header value",
        "authorization": "ApiKey apiKey",
        "content-type": "application/json",
      }
    `)
  })

  it('should allow basic auth', async () => {
    ;(global.fetch as jest.Mock).mockClear()
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(HitsWithNoQueryOrFiltersResponse)
      })
    })

    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        auth: {
          password: 'changeme',
          username: 'elastic'
        }
      },
      search_settings: {
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

    await client.handleInstantSearchRequests(
      nonDynamicFacetRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect((global.fetch as jest.Mock).mock.calls[0][1].headers).toMatchInlineSnapshot(`
      {
        "Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ==",
        "content-type": "application/json",
      }
    `)
  })
})
