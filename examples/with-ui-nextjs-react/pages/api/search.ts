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
      highlight_attributes: ['name'],
      snippet_attributes: ['description'],
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await apiClient.handleRequest(req.body)
  res.send(results)
}
