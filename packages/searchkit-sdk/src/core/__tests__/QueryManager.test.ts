import QueryManager from '../QueryManager'

describe('QueryManager', () => {
  describe('Filter Fns', () => {
    it('no filters in query manager', () => {
      const qm = new QueryManager()
      expect(qm.hasFilters()).toEqual(false)
      expect(qm.getFilters()).toEqual([])
      expect(qm.getFiltersById('nomatch')).toBeNull()
    })

    it('query manager with test filter', () => {
      const qm = new QueryManager()
      qm.setFilters([{ identifier: 'test', value: 'bob' }])
      expect(qm.hasFilters()).toEqual(true)
      expect(qm.getFilters()).toEqual([{ identifier: 'test', value: 'bob' }])
      expect(qm.getFiltersById('test')).toEqual([{ identifier: 'test', value: 'bob' }])
      expect(qm.getFiltersById('nomatch')).toBeNull()
    })
  })

  it('query fns', () => {
    let qm = new QueryManager()
    expect(qm.hasQuery()).toEqual(false)
    qm = new QueryManager()
    qm.setQuery('test')
    expect(qm.hasQuery()).toEqual(true)
    expect(qm.getQuery()).toEqual('test')
  })

  it('query options', () => {
    const qm = new QueryManager()
    qm.setQueryOptions({
      fields: ['test']
    })
    expect(qm.getQueryOptions().fields).toEqual(['test'])
  })
})
