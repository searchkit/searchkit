import Client from '../../'
import { DisjunctiveExampleRequest, SimpleRequest } from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import {
  HitsResponseWithFacetFilter,
  HitsResponseWithNoFacets
} from '../mocks/ElasticsearchResponses'

describe('Integration tests for runtime mapping fields', () => {
  it('call with one filter and query applied', async () => {
    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        runtime_mappings: {
          rating: {
            type: 'keyword',
            script: {
              source: "emit(doc['rated'].size()>0 ? doc['rated'].value : '')"
            }
          }
        },
        search_attributes: ['rating'],
        result_attributes: ['rating'],
        filter_attributes: [{ attribute: 'type', field: 'type', type: 'string' }]
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        return true
      })
      .reply(200, HitsResponseWithNoFacets)

    const response = await client.handleInstantSearchRequests(
      SimpleRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })
})
