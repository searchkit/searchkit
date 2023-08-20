import Client from '@searchkit/api'

const client = Client({
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
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
}

async function handleOptions(request: Request) {
  return new Response(null, {
    headers: corsHeaders
  })
}

async function handleRequest(event: FetchEvent) {
  if (event.request.method === 'OPTIONS') {
    // Handle CORS preflight requests
    return handleOptions(event.request)
  }

  const body = await event.request.json()
  const results = await client.handleRequest(body)

  return new Response(JSON.stringify(results), {
    headers: {
      'content-type': 'application/json',
      ...corsHeaders
    }
  })
}

addEventListener('fetch', (event) => {
  return event.respondWith(handleRequest(event))
})
