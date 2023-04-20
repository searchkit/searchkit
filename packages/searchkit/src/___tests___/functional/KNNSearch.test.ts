import nock from 'nock'
import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('KNNSearch', () => {
  it('should return results', async () => {
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
          'type',
          { field: 'actors.keyword', attribute: 'actors', type: 'string' },
          'rated'
        ]
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).knn
        expect(x).toMatchInlineSnapshot(`
          {
            "field": "dense-vector-field",
            "k": 10,
            "num_candidates": 100,
            "query_vector_builder": {
              "text_embedding": {
                "model_id": "cookie_model",
                "model_text": "shawshank",
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
        getKnnQuery(query, search_attributes, config) {
          return {
            field: 'dense-vector-field',
            k: 10,
            num_candidates: 100,
            query_vector_builder: {
              text_embedding: {
                model_id: 'cookie_model',
                model_text: query
              }
            }
          }
        }
      }
    )

    expect(response).toBeTruthy()
  })
})
