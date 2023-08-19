import { NextRequest, NextResponse } from 'next/server'
import API from '@searchkit/api'

const apiClient = API(
  {
    connection: {
      host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
      // if you are authenticating with api key
      // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
      apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      // if you are authenticating with username/password
      // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
      //auth: {
      //  username: "elastic",
      //  password: "changeme"
      //},
    },
    search_settings: {
      search_attributes: ['title', 'Plot'],
      result_attributes: ['title', 'Plot'],
      facet_attributes: [{ attribute: 'genre', field: 'Genre.keyword', type: 'string' }]
    }
  },
  { debug: true }
)

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json()

  // Example 1: Semantic Search Only
  // const results = await apiClient.handleRequest(data, {
  //   getQuery: () => false,
  //   getKnnQuery: (query) => {
  //     return {
  //       field: 'plot_embedding.predicted_value',
  //       k: 10,
  //       num_candidates: 50,
  //       query_vector_builder: {
  //         text_embedding: {
  //           model_id: 'sentence-transformers__all-minilm-l6-v2',
  //           model_text: query
  //         }
  //       }
  //     }
  //   }
  // })

  // Example 2: Keyword based search Only
  // const results = await apiClient.handleRequest(data)

  // Example 3: Hybrid search
  const results = await apiClient.handleRequest(data, {
    getKnnQuery: (query) => {
      return {
        field: 'plot_embedding.predicted_value',
        k: 10,
        num_candidates: 50,
        query_vector_builder: {
          text_embedding: {
            model_id: 'sentence-transformers__all-minilm-l6-v2',
            model_text: query
          }
        }
      }
    }
  })

  return NextResponse.json(results)
}
