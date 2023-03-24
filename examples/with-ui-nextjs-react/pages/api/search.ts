import API from '@searchkit/api'
import { NextApiRequest, NextApiResponse } from 'next'

const apiClient = API({
  connection: {
    host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
    apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
  },
  search_settings: {
    highlight_attributes: ['title', 'actors'],
    search_attributes: ['title', 'actors'],
    result_attributes: ['title', 'actors', 'poster'],
    facet_attributes: [
      'type',
      { attribute: 'actors', field: 'actors.keyword', type: 'string' },
      'rated',
      { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' },
      { attribute: 'metascore', type: 'numeric', field: 'metascore' }
    ]
  }
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await apiClient.handleRequest(req.body)
  res.send(results)
}
