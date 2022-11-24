import Client, { AlgoliaMultipleQueriesQuery } from '@searchkit/api'
import nock from 'nock'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Add additional base filters to search', () => {
  it('call with one filter and query applied', async () => {
    const client = Client({
      connection: {
        host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
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

    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).query
        // has the base filter applied in addition to the facet filter
        expect(x).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "bool": {
                    "should": [
                      {
                        "term": {
                          "type": "movie",
                        },
                      },
                    ],
                  },
                },
              ],
              "must": {
                "multi_match": {
                  "fields": [
                    "title",
                    "actors",
                    "query",
                  ],
                  "query": "shawshank",
                },
              },
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[],
      {
        getQuery(query, search_attributes) {
          expect(query).toBe('shawshank')
          return {
            multi_match: {
              query,
              fields: search_attributes
            }
          }
        }
      }
    )

    expect(response).toMatchSnapshot()
  })
})
