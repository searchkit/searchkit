import nock from 'nock'
import SearchkitRequest, { GeoBoundingBoxFilter, MultiMatchQuery, SearchkitConfig } from '../../src'
import { RefinementSelectFacet } from '../../src/facets'
import ResultsNoHitsMock from '../__mock-data__/Facets/results-no-hits.json'

describe('Geo Filters', () => {
  it('2 Facets configured, no filters', async () => {
    const config: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      filters: [
        new GeoBoundingBoxFilter({
          field: 'location',
          identifier: 'location',
          label: 'Location'
        })
      ],
      facets: [
        new RefinementSelectFacet({
          field: 'type',
          identifier: 'type',
          label: 'type'
        })
      ]
    }

    const request = SearchkitRequest(config)
    request.setFilters([
      {
        identifier: 'location',
        geoBoundingBox: {
          topLeft: { lat: 50.73, lon: -75.1 },
          bottomRight: { lat: 40.01, lon: -55.12 }
        }
      }
    ])

    let lastESRequest

    const scope = nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        lastESRequest = body
        return ResultsNoHitsMock
      })
      .persist()

    let response = await request.execute({
      facets: true
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toBeDefined()
    expect(response.facets).toHaveLength(1)
    expect(response.facets.map((f) => f.identifier)).toEqual(['type'])
    expect(response.summary.appliedFilters).toMatchInlineSnapshot(`
      Array [
        Object {
          "bottomRight": Object {
            "lat": 40.01,
            "lon": -55.12,
          },
          "display": "GeoBoundingBoxFilter",
          "id": "location_{\\"topLeft\\":{\\"lat\\":50.73,\\"lon\\":-75.1},\\"bottomRight\\":{\\"lat\\":40.01,\\"lon\\":-55.12}}",
          "identifier": "location",
          "label": "Location",
          "topLeft": Object {
            "lat": 50.73,
            "lon": -75.1,
          },
          "type": "GeoBoundingBoxSelectedFilter",
        },
      ]
    `)

    request.setFilters([
      {
        identifier: 'location',
        geoBoundingBox: {
          topLeft: { lat: 50.73, lon: -75.1 },
          bottomRight: { lat: 40.01, lon: -55.12 }
        }
      },
      {
        identifier: 'type',
        value: 'Movie'
      }
    ])

    response = await request.execute({
      facets: true
    })

    expect(lastESRequest.query.bool.filter[0]).toMatchInlineSnapshot(`
      Object {
        "geo_bounding_box": Object {
          "location": Object {
            "bottom_right": Object {
              "lat": 40.01,
              "lon": -55.12,
            },
            "top_left": Object {
              "lat": 50.73,
              "lon": -75.1,
            },
          },
        },
      }
    `)
    expect(response.summary.appliedFilters).toHaveLength(2)
  })
})
