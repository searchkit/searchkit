import Client, { AlgoliaMultipleQueriesQuery, MatchFilter } from '../..'
import nock from 'nock'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Custom Facets and Filters', () => {
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
        {
          field: 'actors.keyword',
          attribute: 'actors',
          type: 'string',
          facetQuery: (field, size) => ({
            significant_terms: {
              field,
              size: size
            }
          }),
          filterQuery: MatchFilter
        }
      ],
      filter_attributes: [
        {
          field: 'writers',
          attribute: 'writers',
          type: 'string',
          filterQuery: MatchFilter
        }
      ]
    }
  })

  it('use the custom filter when specified', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).query
        // has the base filter applied in addition to the facet filter
        expect(x).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "match": {
                    "actors.keyword": "Tom Hanks",
                  },
                },
                {
                  "match": {
                    "writers": "Quentin Tarantino",
                  },
                },
              ],
              "must": {
                "match_all": {},
              },
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((request) => ({
        indexName: request.indexName,
        params: {
          ...request.params,
          query: '',
          facetFilters: ['actors:Tom Hanks', 'writers:Quentin Tarantino']
        }
      })) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })
})
