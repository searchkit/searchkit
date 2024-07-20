/**
 * @jest-environment jsdom
 */

import { AlgoliaMultipleQueriesQuery } from '../../types'
import { nonDynamicFacetRequest } from '../mocks/AlgoliaRequests'
import Client from '../..'
import { HitsWithNoQueryOrFiltersResponse } from '../mocks/ElasticsearchResponses'

describe('Transporter - browser', () => {
  it('should allow basic auth', async () => {
    // @ts-ignore
    global['fetch'] = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ rates: { CAD: 1.42 } })
      })
    )
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
        "content-type": "application/x-ndjson",
      }
    `)
  })
})
