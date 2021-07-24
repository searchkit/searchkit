import QueryManager from '../QueryManager'

describe('QueryManager', () => {
  describe('Filter Fns', () => {
    it('no filters in query manager', () => {
      const qm = new QueryManager([], null, null)
      expect(qm.hasFilters()).toEqual(false)
      expect(qm.getFilters()).toEqual([])
      expect(qm.getFiltersById('nomatch')).toBeNull()
    })

    it('query manager with test filter', () => {
      const qm = new QueryManager([{ identifier: 'test', value: 'bob' }], null, null)
      expect(qm.hasFilters()).toEqual(true)
      expect(qm.getFilters()).toEqual([{ identifier: 'test', value: 'bob' }])
      expect(qm.getFiltersById('test')).toEqual([{ identifier: 'test', value: 'bob' }])
      expect(qm.getFiltersById('nomatch')).toBeNull()
    })
  })

  it('query fns', () => {
    let qm = new QueryManager([], null, null)
    expect(qm.hasQuery()).toEqual(false)
    qm = new QueryManager([], '', null)
    expect(qm.hasQuery()).toEqual(false)
    qm = new QueryManager([], 'test', null)
    expect(qm.hasQuery()).toEqual(true)
    expect(qm.getQuery()).toEqual('test')
  })

  it('query options', () => {
    const qm = new QueryManager([], null, { fields: ['test'] })
    expect(qm.getQueryOptions().fields).toEqual(['test'])
  })
})
