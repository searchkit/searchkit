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
          conditions: [[]],
          actions: [
            {
              action: 'RenderFacetsOrder',
              facetAttributesOrder: ['type', 'actors', 'rated', 'metascore']
            }
          ]
        },
        {
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
          conditions: [
            [
              {
                context: 'query',
                match_type: 'exact',
                value: 'movie'
              }
            ]
          ],
          actions: [
            {
              action: 'RenderUserData',
              userData: '{ "title": "Movie" }'
            },
            {
              action: 'RenderFacetsOrder',
              facetAttributesOrder: ['type']
            },
            {
              action: 'QueryRewrite',
              query: 'one'
            }
          ]
        },
        {
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
