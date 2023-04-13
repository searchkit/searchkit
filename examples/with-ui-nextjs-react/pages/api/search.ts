import API, { MatchFilter } from '@searchkit/api'
import { NextApiRequest, NextApiResponse } from 'next'

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
      highlight_attributes: ['title', 'actors'],
      search_attributes: ['title', 'actors'],
      result_attributes: ['title', 'actors', 'poster'],
      facet_attributes: [
        'type',
        { attribute: 'actors', field: 'actors.keyword', type: 'string' },
        'rated',
        { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' },
        { attribute: 'metascore', type: 'numeric', field: 'metascore' }
      ],
      filter_attributes: [
        {
          attribute: 'writers',
          type: 'string',
          field: 'writers',
          filter: MatchFilter
        }
      ]
    }
  },
  { debug: true }
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await apiClient.handleRequest(req.body)
  res.send(results)
}
