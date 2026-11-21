import { NextRequest, NextResponse } from 'next/server'
import API, { MatchFilter } from '@searchkit/api'

// The connection can be overridden with environment variables (used by the e2e tests
// to point at a local Elasticsearch). Without them the public demo cluster is used.
const DEMO_HOST = 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243'
const DEMO_API_KEY = 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='

const host = process.env.ES_HOST || DEMO_HOST
const connection: { host: string; apiKey?: string; auth?: { username: string; password: string } } =
  { host }

if (process.env.ES_API_KEY) {
  connection.apiKey = process.env.ES_API_KEY
} else if (process.env.ES_USERNAME && process.env.ES_PASSWORD) {
  connection.auth = { username: process.env.ES_USERNAME, password: process.env.ES_PASSWORD }
} else if (!process.env.ES_HOST) {
  // only the demo cluster needs the bundled api key; a custom ES_HOST may have no auth
  connection.apiKey = DEMO_API_KEY
}

const apiClient = API(
  {
    // if you are authenticating with api key
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
    // if you are authenticating with username/password
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
    connection,
    search_settings: {
      highlight_attributes: ['name'],
      snippet_attributes: ['description:200'],
      search_attributes: [
        { field: 'name', weight: 3 },
        { field: 'categories', weight: 2 },
        { field: 'brand', weight: 2 },
        'description'
      ],
      result_attributes: ['name', 'description'],
      facet_attributes: [
        { attribute: 'brand', field: 'brand.keyword', type: 'string' },
        {
          attribute: 'categories.lvl0',
          field: 'hierarchicalCategories.lvl0.keyword',
          type: 'string'
        },
        {
          attribute: 'categories.lvl1',
          field: 'hierarchicalCategories.lvl1.keyword',
          type: 'string'
        },
        {
          attribute: 'categories.lvl2',
          field: 'hierarchicalCategories.lvl2.keyword',
          type: 'string'
        },
        {
          attribute: 'price',
          field: 'price',
          type: 'numeric'
        }
      ],
      filter_attributes: [
        {
          attribute: 'categories',
          field: 'categories.keyword',
          type: 'string'
        }
      ],
      query_rules: [
        {
          id: 'default-state',
          conditions: [[]],
          actions: [
            {
              action: 'RenderFacetsOrder',
              facetAttributesOrder: [
                'categories.lvl0',
                'categories.lvl1',
                'categories.lvl2',
                'price'
              ]
            }
          ]
        },
        {
          id: 'cheap-tvs',
          conditions: [
            [
              {
                context: 'query',
                value: 'cheap tvs',
                match_type: 'exact'
              }
            ]
          ],
          actions: [
            {
              action: 'QueryRewrite',
              query: ''
            },
            {
              action: 'QueryFilter',
              query: 'price:[0 TO 500] AND categories:TVs'
            },
            {
              action: 'QueryBoost',
              query: 'brand:LG',
              weight: 10
            }
          ]
        },
        {
          id: 'tv-categories-facet',
          conditions: [
            [
              {
                context: 'filterPresent',
                values: [
                  {
                    attribute: 'categories.lvl1',
                    value: 'TV & Home Theater > TVs'
                  }
                ]
              }
            ]
          ],
          actions: [
            {
              action: 'RenderFacetsOrder',
              facetAttributesOrder: [
                'categories.lvl0',
                'categories.lvl1',
                'categories.lvl2',
                'brand',
                'price'
              ]
            }
          ]
        },
        {
          id: 'tv-categories-banner',
          conditions: [
            [
              {
                context: 'filterPresent',
                values: [
                  {
                    attribute: 'categories.lvl1',
                    value: 'TV & Home Theater > TVs'
                  }
                ]
              }
            ]
          ],
          actions: [
            {
              action: 'RenderUserData',
              userData: JSON.stringify({
                title: 'We have TVs!',
                body: 'Check out our TVs',
                url: 'https://www.samsung.com'
              })
            }
          ]
        }
      ]
    }
  },
  { debug: true }
)

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json()

  const results = await apiClient.handleRequest(data)
  return NextResponse.json(results)
}
