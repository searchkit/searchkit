import express, { Application, Request, Response } from 'express'
import Client, { SearchkitConfig } from '@searchkit/api'
import 'isomorphic-unfetch'

const app = express()

const config: SearchkitConfig = {
  connection: {
    host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
    // if you're using Elastic cloud
    // cloud_id: "<cloud-id-found-on-deployment-page>",
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
    highlight_attributes: ['title'],
    search_attributes: [{ field: 'title', weight: 3 }, 'actors', 'plot'],
    result_attributes: ['title', 'actors', 'poster', 'plot'],
    facet_attributes: [
      'type',
      { attribute: 'actors', field: 'actors.keyword', type: 'string' },
      'rated',
      { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' },
      { attribute: 'metascore', type: 'numeric', field: 'metascore' }
    ],
    sorting: {
      default: {
        field: '_score',
        order: 'desc'
      },
      _rated_desc: {
        field: 'rated',
        order: 'desc'
      }
    },
    snippet_attributes: ['plot'],
    query_rules: []
  }
}

const apiClient = Client(config)

app.use(express.json())

app.post('/api/search', async function (req, res) {
  const response = await apiClient.handleRequest(req.body)
  res.send(response)
})

app.listen(3001, () => {
  console.log('Server running on port 3000')
})
