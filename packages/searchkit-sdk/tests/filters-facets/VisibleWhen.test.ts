import nock from 'nock'
import SearchkitRequest, { MultiMatchQuery, SearchkitConfig, VisibleWhen } from '../../src'
import { FacetSelectedRule, RefinementSelectFacet } from '../../src/facets'
import ResultsNoHitsMock from '../__mock-data__/Facets/results-no-hits.json'
import QueryManager from '../../src/core/QueryManager'

describe('Visible When Rule system', () => {
  it('success', async () => {
    const customRule = jest.fn((queryManager: QueryManager, ctx: any) => true)

    const config: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      facets: [
        new RefinementSelectFacet({ identifier: 'type', field: 'type.raw', label: 'Type' }),
        VisibleWhen(
          [
            new RefinementSelectFacet({
              identifier: 'writers',
              field: 'writers.raw',
              label: 'Writers',
              display: 'override',
              multipleSelect: true
            }),
            new RefinementSelectFacet({
              identifier: 'actors',
              field: 'actors.raw',
              label: 'Actors'
            }),
            new RefinementSelectFacet({
              identifier: 'genres',
              field: 'genres.raw',
              label: 'Genres'
            })
          ],
          [FacetSelectedRule('type', 'Movie'), customRule]
        )
      ]
    }

    const request = SearchkitRequest(config)

    const scope = nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body) => {
        const facetFieldRequests = (body as any).aggs.facet_bucket_all.aggs
        expect(facetFieldRequests).toBeTruthy()
        expect(facetFieldRequests.type.terms.field).toBe('type.raw')
        expect(Object.keys(facetFieldRequests)).toHaveLength(1)
        return ResultsNoHitsMock
      })

    let response = await request.execute({
      facets: true
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toHaveLength(1)
    expect(response.facets.map((f) => f.identifier)).toEqual(['type'])

    nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body) => {
        const facetFieldRequests = (body as any).aggs.facet_bucket_all.aggs
        expect(facetFieldRequests).toBeTruthy()
        expect(facetFieldRequests.type.terms.field).toBe('type.raw')
        expect(Object.keys(facetFieldRequests).sort()).toEqual(['type', 'actors', 'genres'].sort())
        return ResultsNoHitsMock
      })

    request.setFilters([{ identifier: 'type', value: 'Movie' }])

    response = await request.execute({
      facets: true
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toHaveLength(4)
    expect(response.facets.map((f) => f.identifier).sort()).toEqual(
      ['type', 'writers', 'genres', 'actors'].sort()
    )

    customRule.mockReturnValueOnce(false)

    nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body) => ResultsNoHitsMock)

    response = await request.execute({
      facets: true
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toHaveLength(1)
    expect(response.facets.map((f) => f.identifier).sort()).toEqual(['type'].sort())
  })
})
