import * as _ from 'lodash'
import { NoFiltersHitCountAccessor, ImmutableQuery, TopHitsMetric } from '../../../'

describe('NoFiltersHitCountAccessor', () => {
  beforeEach(() => {
    this.accessor = new NoFiltersHitCountAccessor()
  })

  it('getCount()', () => {
    this.accessor.results = {
      aggregations: {
        no_filters_top_hits: {
          hits: {
            total: 2,
            hits: [1, 2]
          }
        }
      }
    }
    expect(this.accessor.getCount()).toBe(2)
  })

  it('buildOwnQuery() - with no filters', () => {
    const query = new ImmutableQuery()
    expect(this.accessor.buildOwnQuery(query)).toBe(query)
  })

  it('buildOwnQuery()', () => {
    const query = new ImmutableQuery()
      .addSelectedFilter({
        id: 'test',
        name: 'test',
        value: 'val',
        remove: _.identity
      })
      .setQueryString('foo')
    const newQuery = this.accessor.buildOwnQuery(query)
    expect(newQuery).not.toBe(query)
    expect(newQuery.query.aggs).toEqual(
      TopHitsMetric('no_filters_top_hits', { size: 1, _source: false })
    )
  })
})
