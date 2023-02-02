import Client from '@searchkit/api'
import { NextApiRequest, NextApiResponse } from 'next'

const apiClient = Client(
  {
    connection: {
      host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
      apiKey: 'eGV0UTk0UUJfaGpmdGNGZzk3U286MVNkRFZRbWpTcG1tQTdRX2g0MVpPZw=='
    },
    search_settings: {
      highlight_attributes: ['name', 'designerName'],
      search_attributes: [
        'name',
        'designerName',
        'categories_lvl1',
        'categories_lvl2',
        'categories_lvl3'
      ],
      result_attributes: ['name', 'designerName', 'imageURL'],
      facet_attributes: [
        { attribute: 'categories_lvl1', field: 'categories_lvl1.keyword', type: 'string' },
        { attribute: 'categories_lvl2', field: 'categories_lvl2.keyword', type: 'string' },
        { attribute: 'categories_lvl3', field: 'categories_lvl3.keyword', type: 'string' },
        { attribute: 'designerName', field: 'designerName.keyword', type: 'string' },
        { attribute: 'price', type: 'numeric', field: 'price' }
      ],
      filter_attributes: [{ attribute: 'outOfStock', field: 'outOfStock', type: 'string' }],
      query_rules: [],
      sorting: {
        default: {
          field: '_score',
          order: 'desc'
        },
        _price_desc: {
          field: 'price',
          order: 'desc'
        },
        _price_asc: {
          field: 'price',
          order: 'asc'
        }
      }
    }
  },
  { debug: true }
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await apiClient.handleRequest(req.body)
  res.send(results)
}
