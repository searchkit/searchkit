import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import nock from 'nock'
import {
  DisjunctiveExampleRequest,
  GeoFilterBoundingBoxQueryExampleRequest,
  GeoFilterQueryExampleRequest
} from '../mocks/AlgoliaRequests'
import { ExampleGeoDistanceResponse } from '../mocks/ElasticsearchResponses'

describe('Geo Filters', () => {
  it('aroundLatLng', async () => {
    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        geo_attribute: 'location',
        search_attributes: [],
        result_attributes: []
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).query
        // has the base filter applied in addition to the facet filter
        expect(x).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "geo_distance": {
                    "distance": "1000m",
                    "location": {
                      "lat": "40.7128",
                      "lon": "-74.0060",
                    },
                  },
                },
              ],
              "must": {
                "match_all": {},
              },
            },
          }
        `)
        return true
      })
      .reply(200, ExampleGeoDistanceResponse)

    const response = await client.handleInstantSearchRequests(
      GeoFilterQueryExampleRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })

  it('insideBoundingBox', async () => {
    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        geo_attribute: 'location',
        search_attributes: [],
        result_attributes: []
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).query
        // has the base filter applied in addition to the facet filter
        expect(x).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "geo_bounding_box": {
                    "location": {
                      "bottom_left": {
                        "lat": 37.224209312978665,
                        "lon": -120.86245498048939,
                      },
                      "top_right": {
                        "lat": 38.30977110856795,
                        "lon": -116.00649794923939,
                      },
                    },
                  },
                },
              ],
              "must": {
                "match_all": {},
              },
            },
          }
        `)
        return true
      })
      .reply(200, ExampleGeoDistanceResponse)

    const response = await client.handleInstantSearchRequests(
      GeoFilterBoundingBoxQueryExampleRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })
})
