import express from "express";
import Client from "@searchkit/api";
import 'isomorphic-unfetch'

const app = express();

const config = {
  connection: {
    host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
    apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
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
}
 
const apiClient = Client(config);

app.use(express.json());
 
app.post("/api/search", async function (req, res) {
  const response = await apiClient.handleRequest(req.body);
  res.send(response);
});
 

app.listen(3001, () => {
  console.log("Server running on port 3000");
});
