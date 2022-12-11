import Client from '@searchkit/api'
import { NextApiRequest, NextApiResponse } from 'next'

const apiClient = Client({
  connection: {
    host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
    apiKey: 'eGV0UTk0UUJfaGpmdGNGZzk3U286MVNkRFZRbWpTcG1tQTdRX2g0MVpPZw=='
  },
  search_settings: {
    highlight_attributes: ['name', 'designername'],
    search_attributes: ['name', 'designername'],
    result_attributes: ['name', 'designerName', 'imageURL'],
    facet_attributes: [
      { attribute: 'categories_lvl1', field: 'categories_lvl1.keyword', type: 'string' },
      { attribute: 'categories_lvl2', field: 'categories_lvl2.keyword', type: 'string' },
      { attribute: 'categories_lvl3', field: 'categories_lvl3.keyword', type: 'string' },
      { attribute: 'designerName', field: 'designerName.keyword', type: 'string' },
      { attribute: 'price', type: 'numeric', field: 'price' }
    ],
    query_rules: []
  }
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await apiClient.handleRequest(req.body)
  res.send(results)
}
