import nock from 'nock'
import SearchkitRequest from '../../src'
import { RefinementSelectFacet } from '../../src/facets'
import ResultsNoHitsMock from '../__mock-data__/Facets/results-no-hits.json'

describe('Facets', () => {
  it('2 Facets configured, no filters', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      hits: {
        fields: ['facet1']
      },
      facets: [
        new RefinementSelectFacet({
          field: 'writers',
          identifier: 'writers',
          label: 'Writers'
        }),
        new RefinementSelectFacet({
          field: 'actors',
          identifier: 'actors',
          label: 'Actors',
          multipleSelect: false
        })
      ],
      index: 'test'
    })

    const scope = nock('http://localhost:9200')
      .post('/test/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        return ResultsNoHitsMock
      })

    const response = await request.execute({
      facets: true
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toBeDefined()
    expect(response.facets).toHaveLength(2)
    expect(response.facets.map((f) => f.identifier)).toEqual(['writers', 'actors'])
  })

  it('2 Facets configured, with two filters in each facet', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      hits: {
        fields: []
      },
      facets: [
        new RefinementSelectFacet({
          field: 'writers',
          identifier: 'writers',
          label: 'Writers'
        }),
        new RefinementSelectFacet({
          field: 'actors',
          identifier: 'actors',
          label: 'Actors',
          multipleSelect: false
        })
      ],
      index: 'test'
    })

    request.setFilters([
      { identifier: 'writers', value: 'writer1' },
      { identifier: 'actors', value: 'actors' }
    ])

    const scope = nock('http://localhost:9200')
      .post('/test/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        return ResultsNoHitsMock
      })

    const response = await request.execute({
      facets: true
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toBeDefined()
    expect(response.facets).toHaveLength(2)
    expect(response.facets.map((f) => f.identifier)).toEqual(['writers', 'actors'])
    expect(response.summary.appliedFilters).toMatchInlineSnapshot(`
      Array [
        Object {
          "display": "ListFacet",
          "id": "writers_writer1",
          "identifier": "writers",
          "label": "Writers",
          "type": "ValueSelectedFilter",
          "value": "writer1",
        },
        Object {
          "display": "ListFacet",
          "id": "actors_actors",
          "identifier": "actors",
          "label": "Actors",
          "type": "ValueSelectedFilter",
          "value": "actors",
        },
      ]
    `)
  })

  it('2 Facets configured, with two filters in each facet, specify a particular facet only to be returned', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      hits: {
        fields: []
      },
      facets: [
        new RefinementSelectFacet({
          field: 'writers',
          identifier: 'writers',
          label: 'Writers'
        }),
        new RefinementSelectFacet({
          field: 'actors',
          identifier: 'actors',
          label: 'Actors',
          multipleSelect: false
        })
      ],
      index: 'test'
    })

    request.setFilters([
      { identifier: 'writers', value: 'writer1' },
      { identifier: 'actors', value: 'actors' }
    ])

    const scope = nock('http://localhost:9200')
      .post('/test/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        return ResultsNoHitsMock
      })

    const response = await request.execute({
      facets: [{ identifier: 'writers' }]
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toBeDefined()
    expect(response.facets).toHaveLength(1)
    expect(response.facets.map((f) => f.identifier)).toEqual(['writers'])
  })

  it('2 Facets configured, with two filters in each facet, specify both facets to be returned (test multiple works)', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      hits: {
        fields: []
      },
      facets: [
        new RefinementSelectFacet({
          field: 'writers',
          identifier: 'writers',
          label: 'Writers'
        }),
        new RefinementSelectFacet({
          field: 'actors',
          identifier: 'actors',
          label: 'Actors',
          multipleSelect: false
        })
      ],
      index: 'test'
    })

    request.setFilters([
      { identifier: 'writers', value: 'writer1' },
      { identifier: 'actors', value: 'actors' }
    ])

    const scope = nock('http://localhost:9200')
      .post('/test/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        return ResultsNoHitsMock
      })

    const response = await request.execute({
      facets: [{ identifier: 'writers' }, { identifier: 'actors' }]
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toBeDefined()
    expect(response.facets).toHaveLength(2)
    expect(response.facets.map((f) => f.identifier)).toEqual(['writers', 'actors'])
  })

  it('facet overrides possible via facet array', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      hits: {
        fields: []
      },
      facets: [
        new RefinementSelectFacet({
          field: 'writers',
          identifier: 'writers',
          label: 'Writers'
        }),
        new RefinementSelectFacet({
          field: 'actors',
          identifier: 'actors',
          label: 'Actors',
          multipleSelect: false
        })
      ],
      index: 'test'
    })

    request.setFilters([
      { identifier: 'writers', value: 'writer1' },
      { identifier: 'actors', value: 'actors' }
    ])

    const scope = nock('http://localhost:9200')
      .post('/test/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchSnapshot()
        return ResultsNoHitsMock
      })

    const response = await request.execute({
      facets: [
        { identifier: 'writers', query: 'writersQuery' },
        { identifier: 'actors', size: 10 }
      ]
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toBeDefined()
    expect(response.facets).toHaveLength(2)
    expect(response.facets.map((f) => f.identifier)).toEqual(['writers', 'actors'])
  })
})
