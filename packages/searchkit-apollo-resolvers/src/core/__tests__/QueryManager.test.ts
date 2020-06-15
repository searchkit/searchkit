import QueryManager from '../QueryManager'

describe('QueryManager', () => {
  describe('Filter Fns', () => {
    it('no filters in query manager', () => {
      const qm = new QueryManager([], null)
      expect(qm.hasFilters()).toEqual(false)
      expect(qm.getFilters()).toEqual([])
      expect(qm.getFiltersById('nomatch')).toBeNull()
    })

    it('query manager with test filter', () => {
      const qm = new QueryManager([{ id: 'test', value: 'bob' }], null)
      expect(qm.hasFilters()).toEqual(true)
      expect(qm.getFilters()).toEqual([{ id: 'test', value: 'bob' }])
      expect(qm.getFiltersById('test')).toEqual([{ id: 'test', value: 'bob' }])
      expect(qm.getFiltersById('nomatch')).toBeNull()
    })
  })

  it('query fns', () => {
    let qm = new QueryManager([], null)
    expect(qm.hasQuery()).toEqual(false)
    qm = new QueryManager([], '')
    expect(qm.hasQuery()).toEqual(false)
    qm = new QueryManager([], 'test')
    expect(qm.hasQuery()).toEqual(true)
    expect(qm.getQuery()).toEqual('test')
  })
})
