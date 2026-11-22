import { NextRequest, NextResponse } from 'next/server'
import API from '@searchkit/api'

const apiClient = API(
  {
    connection: {
      host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
      // if you are authenticating with api key
      // https://www.searchkit.co/docs/adapters/elasticsearch#connecting-with-api-key
      apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      // if you are authenticating with username/password
      // https://www.searchkit.co/docs/adapters/elasticsearch#connecting-with-usernamepassword
      //auth: {
      //  username: "elastic",
      //  password: "changeme"
      //},
    },
    search_settings: {
      search_attributes: ['title', 'Plot'],
      result_attributes: ['title', 'Plot'],
      facet_attributes: [{ attribute: 'genre', field: 'Genre.keyword', type: 'string' }],
      // Hybrid search: combines the keyword query with a KNN search on the plot embeddings
      // (reciprocal rank fusion). Elasticsearch embeds the query with the deployed model.
      semantic_search: {
        field: 'plot_embedding.predicted_value',
        model_id: 'sentence-transformers__all-minilm-l6-v2',
        k: 10,
        num_candidates: 50,
        // 'hybrid' (default): keyword + semantic search
        // 'semantic_only': semantic search only
        // 'text_only': keyword search only
        mode: 'hybrid'
      }
    }
  },
  { debug: true }
)

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json()

  const results = await apiClient.handleRequest(data)

  return NextResponse.json(results)
}
