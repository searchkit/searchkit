import {
  getFacetFiltersAst,
  getFilterAst,
  getGeoFiltersAst,
  getNumericFiltersAst
} from '../filters'
import type { SearchSettingsConfig } from '../types'

const request = (params: Record<string, unknown>) => ({ indexName: 'index', params })

const settings: SearchSettingsConfig = {
  search_attributes: [],
  result_attributes: [],
  facet_attributes: ['type', { attribute: 'price', field: 'price', type: 'numeric' }],
  geo_attribute: 'location'
}

describe('filter AST builders', () => {
  it('facetFilters: eq per conjunctive entry, or per disjunctive group, unescaping a leading "-"', () => {
    expect(
      getFacetFiltersAst(request({ facetFilters: [['type:movie', 'type:\\-series'], 'type:a:b'] }))
    ).toEqual([
      {
        op: 'or',
        nodes: [
          { op: 'eq', attribute: 'type', value: 'movie' },
          { op: 'eq', attribute: 'type', value: '-series' }
        ]
      },
      { op: 'eq', attribute: 'type', value: 'a:b' }
    ])
    expect(getFacetFiltersAst(request({ facetFilters: 'type:movie' }))).toEqual([])
  })

  it('numericFilters: comparisons, != and TO ranges, keeping the operands as written', () => {
    expect(
      getNumericFiltersAst(
        request({
          numericFilters: [
            'price=10',
            'price!=5',
            'price>1.',
            'price >= -.5',
            'price<3',
            'price<=4'
          ]
        })
      )
    ).toEqual([
      { op: 'eq', attribute: 'price', value: 10, raw: '10' },
      { op: 'not', node: { op: 'eq', attribute: 'price', value: 5, raw: '5' } },
      { op: 'range', attribute: 'price', gt: 1, raw: { gt: '1.' } },
      { op: 'range', attribute: 'price', gte: -0.5, raw: { gte: '-.5' } },
      { op: 'range', attribute: 'price', lt: 3, raw: { lt: '3' } },
      { op: 'range', attribute: 'price', lte: 4, raw: { lte: '4' } }
    ])
    expect(getNumericFiltersAst(request({ numericFilters: ['price:10 TO 20'] }))).toEqual([
      { op: 'range', attribute: 'price', gte: 10, lte: 20, raw: { gte: '10', lte: '20' } }
    ])
  })

  it('geo: bounding boxes, else around a point', () => {
    expect(getGeoFiltersAst(request({ insideBoundingBox: '1,2,3,4' }), settings)).toEqual([
      { op: 'geo_bbox', attribute: 'location', box: [1, 2, 3, 4] }
    ])
    expect(
      getGeoFiltersAst(
        request({
          insideBoundingBox: [
            [1, 2, 3, 4],
            [5, 6, 7, 8]
          ],
          aroundLatLng: '1,2'
        }),
        settings
      )
    ).toEqual([
      {
        op: 'or',
        nodes: [
          { op: 'geo_bbox', attribute: 'location', box: [1, 2, 3, 4] },
          { op: 'geo_bbox', attribute: 'location', box: [5, 6, 7, 8] }
        ]
      }
    ])
    expect(
      getGeoFiltersAst(request({ aroundLatLng: '51.5, -0.1', aroundRadius: 5000 }), settings)
    ).toEqual([
      {
        op: 'geo_distance',
        attribute: 'location',
        lat: 51.5,
        lng: -0.1,
        radius: 5000,
        raw: { lat: '51.5', lng: ' -0.1' }
      }
    ])
    expect(
      getGeoFiltersAst(request({ aroundLatLng: '1,2' }), { ...settings, geo_attribute: undefined })
    ).toEqual([])
  })

  it('getFilterAst combines all the request filters', () => {
    expect(
      getFilterAst(
        request({
          facetFilters: ['type:movie'],
          numericFilters: ['price>10'],
          filters: 'type:series OR type:movie',
          aroundLatLng: '1,2'
        }),
        settings
      )
    ).toEqual({
      op: 'and',
      nodes: [
        { op: 'eq', attribute: 'type', value: 'movie' },
        { op: 'range', attribute: 'price', gt: 10, raw: { gt: '10' } },
        {
          op: 'or',
          nodes: [
            { op: 'eq', attribute: 'type', value: 'series', raw: 'series' },
            { op: 'eq', attribute: 'type', value: 'movie', raw: 'movie' }
          ]
        },
        {
          op: 'geo_distance',
          attribute: 'location',
          lat: 1,
          lng: 2,
          radius: undefined,
          raw: { lat: '1', lng: '2' }
        }
      ]
    })
    expect(getFilterAst(request({ query: 'x' }), settings)).toBeNull()
  })
})
