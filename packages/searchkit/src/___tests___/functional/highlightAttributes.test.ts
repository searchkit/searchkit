import Client from '../../'
import { SimpleNoFilterRequest } from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import { HitsResponseWithObjectHighlight } from '../mocks/ElasticsearchResponses'

describe('Integration tests for highlight Attributes', () => {
  const config = {
    connection: {
      host: 'http://0.0.0.0:8200',
      apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
    },
    search_settings: {
      search_attributes: ['title', 'actors', 'query'],
      result_attributes: ['title', 'actors', 'query'],
      highlight_attributes: ['meta.title']
    }
  }

  it('should have highlight for title', async () => {
    const client = new Client(config as unknown as any)
    nock('http://0.0.0.0:8200')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.highlight.fields).toMatchInlineSnapshot(`
          {
            "meta.title": {
              "number_of_fragments": 0,
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithObjectHighlight)

    const response = await client.handleInstantSearchRequests(
      SimpleNoFilterRequest as AlgoliaMultipleQueriesQuery[]
    )
    // @ts-ignore
    expect(response.results[0].hits[0]._highlightResult).toMatchInlineSnapshot(`
      {
        "meta": {
          "title": {
            "fullyHighlighted": false,
            "matchLevel": "full",
            "matchedWords": [
              "Shawshank",
            ],
            "value": "The <em>Shawshank</em> Redemption",
          },
        },
      }
    `)
  })
})
