import Client, { AlgoliaMultipleQueriesQuery } from '../..'
import nock from 'nock'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('facets', () => {
  it('simple string facet', async () => {
    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        highlight_attributes: ['title'],
        search_attributes: ['title'],
        result_attributes: ['title'],
        facet_attributes: ['rated', 'type']
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1])

        expect(x.aggs).toMatchInlineSnapshot(`
          {
            "rated": {
              "terms": {
                "field": "rated",
                "size": 10,
              },
            },
            "type": {
              "terms": {
                "field": "type",
                "size": 10,
              },
            },
          }
        `)

        // has the nested filter applied
        expect(x.query).toMatchInlineSnapshot(`
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
                "bool": {
                  "should": [
                    {
                      "bool": {
                        "should": [
                          {
                            "multi_match": {
                              "fields": [
                                "title",
                              ],
                              "fuzziness": "AUTO:4,8",
                              "query": "shawshank",
                            },
                          },
                          {
                            "multi_match": {
                              "fields": [
                                "title",
                              ],
                              "query": "shawshank",
                              "type": "bool_prefix",
                            },
                          },
                        ],
                      },
                    },
                    {
                      "multi_match": {
                        "fields": [
                          "title",
                        ],
                        "query": "shawshank",
                        "type": "phrase",
                      },
                    },
                  ],
                },
              },
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })
})
