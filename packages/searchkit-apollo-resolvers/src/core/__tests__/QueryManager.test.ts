import QueryManager from '../QueryManager'

describe('QueryManager', () => {
  it('hasFilters()', () => {
    let qm = new QueryManager([], null)
    expect(qm.hasFilters()).toEqual(false)
    qm = new QueryManager([{ id: 'test', selected: ['bob'] }], null)
    expect(qm.hasFilters()).toEqual(true)
  })

  it('hasQuery()', () => {
    let qm = new QueryManager([], null)
    expect(qm.hasQuery()).toEqual(false)
    qm = new QueryManager([], '')
    expect(qm.hasQuery()).toEqual(false)
    qm = new QueryManager([], 'test')
    expect(qm.hasQuery()).toEqual(true)
  })
})
