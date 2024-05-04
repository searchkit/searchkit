import Client, { AlgoliaMultipleQueriesQuery, FacetStringResponse, MatchFilter } from '../..'
import nock from 'nock'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import {
  HitsResponseWithCustomFacetFilter,
  HitsResponseWithFacetFilter
} from '../mocks/ElasticsearchResponses'
import { title } from 'process'
import {
  AggregationsBuckets,
  AggregationsFilterAggregate,
  AggregationsFiltersAggregate,
  AggregationsFiltersBucket
} from '@elastic/elasticsearch/lib/api/types'

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
          field: 'type.keyword',
          attribute: 'type',
          type: 'string',
          facetQuery: () => ({
            filters: {
              filters: {
                movie: {
                  term: {
                    type: 'movie'
                  }
                },
                episode: {
                  term: {
                    type: 'episode'
                  }
                }
              }
            }
          }),
          facetResponse: (aggregation: AggregationsFiltersAggregate) => {
            const buckets = aggregation.buckets as AggregationsFiltersBucket[]
            return Object.keys(buckets).reduce(
              (sum, bucket) => ({
                ...sum,
                [bucket]: 100
              }),
              {}
            )
          },
          filterQuery: (field: string, value: string) => {
            return { match: { ['type.keyword']: value } }
          }
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
                    "type.keyword": "episodee",
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
      .reply(200, HitsResponseWithCustomFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((request) => ({
        indexName: request.indexName,
        params: {
          ...request.params,
          query: '',
          facetFilters: ['type:episodee', 'writers:Quentin Tarantino']
        }
      })) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })
})
