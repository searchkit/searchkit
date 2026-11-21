import type { SearchkitConfig, SearchSettingsConfig } from '@searchkit/api'
import { PostgresAdapter } from '@searchkit/adapter-postgres'

// The Searchkit configuration of the example's API routes (app/api/search, and app/api/semantic for the
// semantic search e2e tests).

// The example searches Elasticsearch by default. The connection can be overridden with environment variables
// (used by the e2e tests to point at a local Elasticsearch). Without them the public demo cluster is used.
// With SEARCH_ADAPTER=postgres and DATABASE_URL set, it searches the `products` table in Postgres instead
// (e2e/seed-postgres.mjs creates it).
const DEMO_HOST = 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243'
const DEMO_API_KEY = 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='

const usePostgres = process.env.SEARCH_ADAPTER === 'postgres' && !!process.env.DATABASE_URL
if (process.env.SEARCH_ADAPTER === 'postgres' && !process.env.DATABASE_URL) {
  console.warn(
    'SEARCH_ADAPTER=postgres is set without DATABASE_URL; searching Elasticsearch instead'
  )
}

const getElasticsearchConnection = () => {
  const host = process.env.ES_HOST || DEMO_HOST
  const connection: {
    host: string
    apiKey?: string
    auth?: { username: string; password: string }
  } = { host }

  if (process.env.ES_API_KEY) {
    connection.apiKey = process.env.ES_API_KEY
  } else if (process.env.ES_USERNAME && process.env.ES_PASSWORD) {
    connection.auth = { username: process.env.ES_USERNAME, password: process.env.ES_PASSWORD }
  } else if (!process.env.ES_HOST) {
    // only the demo cluster needs the bundled api key; a custom ES_HOST may have no auth
    connection.apiKey = DEMO_API_KEY
  }
  return connection
}

// Settings shared by both engines, so they cannot drift. Only the fields differ (below).
const sharedSettings = {
  highlight_attributes: ['name'],
  snippet_attributes: ['description:200'],
  search_attributes: [
    { field: 'name', weight: 3 },
    { field: 'categories', weight: 2 },
    { field: 'brand', weight: 2 },
    'description'
  ],
  // price is returned so the sorting can be checked (e2e/tests/api.spec.ts)
  result_attributes: ['name', 'description', 'price'],
  // indexName `products_price_asc` sorts by ascending price
  sorting: {
    _price_asc: { field: 'price', order: 'asc' }
  },
  query_rules: [
    {
      id: 'default-state',
      conditions: [[]],
      actions: [
        {
          action: 'RenderFacetsOrder',
          facetAttributesOrder: ['categories.lvl0', 'categories.lvl1', 'categories.lvl2', 'price']
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
} satisfies Partial<SearchSettingsConfig>

const elasticsearchSettings: SearchSettingsConfig = {
  ...sharedSettings,
  facet_attributes: [
    { attribute: 'brand', field: 'brand.keyword', type: 'string' },
    // the same field with its values ordered by term instead of by count (see /facet-order)
    { attribute: 'brand_az', field: 'brand.keyword', type: 'string', order: 'alpha' },
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
  ]
}

// Columns of the `products` table (e2e/seed-postgres.mjs): one column per hierarchical level
const postgresSettings: SearchSettingsConfig = {
  ...sharedSettings,
  facet_attributes: [
    { attribute: 'brand', field: 'brand', type: 'string' },
    // the same column with its values ordered by term instead of by count (see /facet-order)
    { attribute: 'brand_az', field: 'brand', type: 'string', order: 'alpha' },
    { attribute: 'categories.lvl0', field: 'hierarchical_categories_lvl0', type: 'string' },
    { attribute: 'categories.lvl1', field: 'hierarchical_categories_lvl1', type: 'string' },
    { attribute: 'categories.lvl2', field: 'hierarchical_categories_lvl2', type: 'string' },
    { attribute: 'price', field: 'price', type: 'numeric' }
  ],
  filter_attributes: [{ attribute: 'categories', field: 'categories', type: 'string', array: true }]
}

// one adapter (and so one connection pool) for every route
const postgresAdapter = usePostgres
  ? PostgresAdapter({
      connection: process.env.DATABASE_URL as string,
      indices: {
        products: {
          table: 'products',
          id_column: 'id',
          search_vector_column: 'search_vector',
          text_search_config: 'english'
        }
      }
    })
  : undefined

/**
 * The Searchkit configuration for the engine in use, with `overrides` applied to its search settings.
 */
export const getSearchkitConfig = (
  overrides: Partial<SearchSettingsConfig> = {}
): SearchkitConfig =>
  postgresAdapter
    ? {
        adapter: postgresAdapter,
        search_settings: { ...postgresSettings, ...overrides }
      }
    : {
        // if you are authenticating with api key
        // https://www.searchkit.co/docs/adapters/elasticsearch#connecting-with-api-key
        // if you are authenticating with username/password
        // https://www.searchkit.co/docs/adapters/elasticsearch#connecting-with-usernamepassword
        connection: getElasticsearchConnection(),
        search_settings: { ...elasticsearchSettings, ...overrides }
      }

export { sharedSettings }
