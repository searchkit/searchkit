import Client from '@searchkit/api'
import { NextApiRequest, NextApiResponse } from 'next'

const client = Client(
  {
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
      ],
      query_rules: [
        {
          id: '1',
          conditions: [[]],
          actions: [
            {
              action: 'RenderFacetsOrder',
              facetAttributesOrder: ['type', 'actors', 'rated', 'metascore']
            }
          ]
        },
        {
          id: '2',
          conditions: [
            [
              {
                context: 'filterPresent',
                values: [{ attribute: 'type', value: 'movie' }]
              }
            ]
          ],
          actions: [
            {
              action: 'RenderFacetsOrder',
              facetAttributesOrder: ['type', 'actors', 'rated', 'imdbrating', 'metascore']
            }
          ]
        },
        {
          id: '3',
          conditions: [
            [
              {
                context: 'query',
                match_type: 'prefix',
                value: 'star'
              }
            ]
          ],
          actions: [
            {
              action: 'PinnedResult',
              documentIds: ['tt0111161']
            }
          ]
        },
        {
          id: '4',
          conditions: [
            [
              {
                context: 'query',
                match_type: 'exact',
                value: 'episode'
              }
            ]
          ],
          actions: [
            {
              action: 'RenderUserData',
              userData: '{ "title": "Episode" }'
            },
            {
              action: 'RenderFacetsOrder',
              facetAttributesOrder: ['type']
            },
            {
              action: 'QueryRewrite',
              query: 'tv episodes'
            }
          ]
        },
        {
          id: '5',
          conditions: [
            [
              {
                context: 'filterPresent',
                values: [{ attribute: 'type', value: 'movie' }]
              }
            ]
          ],
          actions: [
            {
              action: 'RenderUserData',
              userData: '{ "title": "Movie has been selected" }'
            },
            {
              action: 'PinnedResult',
              documentIds: ['tt0468569']
            }
          ]
        },
        {
          id: '6',
          conditions: [
            [
              {
                context: 'query',
                value: 'movie',
                match_type: 'exact'
              }
            ]
          ],
          actions: [
            {
              action: 'QueryBoost',
              query: 'actors:"Dan Aykroyd" OR actors:"Charlie Sheen"',
              weight: 2
            },
            {
              action: 'QueryFilter',
              query: 'type:"movie"'
            }
          ]
        }
      ]
    }
  },
  { debug: true }
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await client.handleRequest(req.body, {
    // getQuery: (query, search_attributes) => {
    //   return [
    //     {
    //       combined_fields: {
    //         query,
    //         fields: search_attributes,
    //       },
    //     },
    //   ];
    // },
    getBaseFilters: () => {
      return [
        {
          bool: {
            must: {
              range: {
                imdbrating: {
                  gte: 1
                }
              }
            }
          }
        }
      ]
    }
  })
  res.send(results)
}
