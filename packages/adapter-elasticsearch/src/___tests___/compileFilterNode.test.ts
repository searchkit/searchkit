import { compileFilterNode } from '../filters'
import { parseFilters } from '@searchkit/core'

const field = (attribute: string) => `${attribute}.keyword`

describe('compileFilterNode', () => {
  it('compiles boolean nodes, comparisons and ranges', () => {
    expect(
      compileFilterNode(
        parseFilters('(type:movie OR type:"tv show") AND NOT price:[1 TO 5} AND rating:>=3'),
        field
      )
    ).toEqual({
      bool: {
        filter: [
          {
            bool: {
              should: [
                { term: { 'type.keyword': 'movie' } },
                { term: { 'type.keyword': 'tv show' } }
              ]
            }
          },
          { bool: { must_not: { range: { 'price.keyword': { gte: '1', lt: '5' } } } } },
          { range: { 'rating.keyword': { gte: '3' } } }
        ]
      }
    })
  })

  it('compiles in / exists / geo nodes', () => {
    expect(compileFilterNode({ op: 'in', attribute: 'type', values: ['a', 1] }, field)).toEqual({
      terms: { 'type.keyword': ['a', 1] }
    })
    expect(compileFilterNode({ op: 'exists', attribute: 'type' }, field)).toEqual({
      exists: { field: 'type.keyword' }
    })
    expect(
      compileFilterNode(
        { op: 'geo_distance', attribute: 'loc', lat: 1, lng: 2, radius: 10 },
        (a) => a
      )
    ).toEqual({ geo_distance: { distance: 10, loc: { lat: 1, lon: 2 } } })
    expect(
      compileFilterNode({ op: 'geo_distance', attribute: 'loc', lat: 1, lng: 2 }, (a) => a)
    ).toEqual({ geo_distance: { distance: '1000m', loc: { lat: 1, lon: 2 } } })
  })

  it('uses typed values when there is no raw value', () => {
    expect(compileFilterNode({ op: 'eq', attribute: 'n', value: 5 }, (a) => a)).toEqual({
      term: { n: 5 }
    })
    expect(compileFilterNode({ op: 'range', attribute: 'n', gt: 5, lte: 9 }, (a) => a)).toEqual({
      range: { n: { gt: 5, lte: 9 } }
    })
  })
})
