import nock from 'nock'
import SearchkitRequest, { NumericRangeFilter, SearchkitConfig } from '../../src'
import ResultsNoHitsMock from '../__mock-data__/Facets/results-no-hits.json'

describe('NumericRangeFilter', () => {
  it('Combination of min and max number filters', async () => {
    const moviesSearchConfig: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      filters: [
        new NumericRangeFilter({
          identifier: 'imdbRating',
          field: 'imdbRating',
          label: 'IMDB Rating'
        })
      ]
    }

    const request = SearchkitRequest(moviesSearchConfig)
    request.setFilters([
      {
        identifier: 'imdbRating',
        min: 5,
        max: 10
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
    expect(response.summary.appliedFilters).toMatchInlineSnapshot(`
      Array [
        Object {
          "display": "RangeFilter",
          "id": "imdbRating_5_10",
          "identifier": "imdbRating",
          "label": "IMDB Rating",
          "max": 10,
          "min": 5,
          "type": "NumericRangeSelectedFilter",
        },
      ]
    `)

    request.setFilters([
      {
        identifier: 'imdbRating',
        min: 5
      }
    ])

    response = await request.execute({
      facets: true
    })

    expect(lastESRequest.query.bool.filter[0]).toMatchInlineSnapshot(`
      Object {
        "range": Object {
          "imdbRating": Object {
            "gte": 5,
          },
        },
      }
    `)
    expect(response.summary.appliedFilters).toHaveLength(1)

    request.setFilters([
      {
        identifier: 'imdbRating',
        max: 5
      }
    ])

    response = await request.execute({
      facets: true
    })

    expect(lastESRequest.query.bool.filter[0]).toMatchInlineSnapshot(`
        Object {
          "range": Object {
            "imdbRating": Object {
              "lte": 5,
            },
          },
        }
      `)
    expect(response.summary.appliedFilters).toHaveLength(1)
  })
})
