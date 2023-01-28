import Client, { AlgoliaMultipleQueriesQuery } from '../..'
import nock from 'nock'
import { ExampleNestedFacetQueryResponse } from '../mocks/ElasticsearchResponses'
import { NestedFacetQueryExampleRequest } from '../mocks/AlgoliaRequests'

describe('nested facetQuery', () => {
  it('nested facet with query', async () => {
    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        highlight_attributes: ['title'],
        search_attributes: ['title'],
        result_attributes: ['title'],
        facet_attributes: [
          {
            attribute: 'user.first',
            field: 'first.keyword',
            type: 'string',
            nestedPath: 'user'
          }
        ]
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1])

        expect(x.aggs).toMatchInlineSnapshot(`
          {
            "user.": {
              "aggs": {
                "user.first": {
                  "terms": {
                    "field": "user.first.keyword",
                    "include": "([a-zA-Z]+ )+?[hH][aA][rR].*",
                    "size": 10,
                  },
                },
              },
              "nested": {
                "path": "user",
              },
            },
          }
        `)

        return true
      })
      .reply(200, ExampleNestedFacetQueryResponse)

    const response = await client.handleInstantSearchRequests(
      NestedFacetQueryExampleRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchInlineSnapshot(`
      {
        "results": [
          {
            "exhaustiveFacetsCount": true,
            "facetHits": [
              {
                "count": 2,
                "highlighted": "<ais-highlight-0000000000>Har</ais-highlight-0000000000>ibo",
                "value": "Haribo",
              },
            ],
            "processingTimeMS": 1,
          },
        ],
      }
    `)
  })
})
