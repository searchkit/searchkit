import { HitsAccessor, SearchkitManager } from '../../../'

describe('HitsAccessor', () => {
  const scroll = { scrollTop: 99 }

  beforeEach(() => {
    this.searchkit = SearchkitManager.mock()
    this.accessor = new HitsAccessor({ scrollTo: '#scrolltome' })
    this.searchkit.setResults({
      hits: {
        hits: [
          { _id: 1, title: 1 },
          { _id: 2, title: 2 }
        ],
        total: 2
      }
    })
    this.searchkit.addAccessor(this.accessor)
    spyOn(document, 'querySelector').and.returnValue(scroll)
  })

  it('constructor()()', () => {
    expect(this.accessor.options).toEqual({
      scrollTo: '#scrolltome'
    })
  })

  it('setResults()', () => {
    this.searchkit.setResults({
      hits: {
        hits: [
          { _id: 1, title: 1 },
          { _id: 2, title: 2 }
        ],
        total: 2
      }
    })
    expect(document.querySelector).not.toHaveBeenCalled()
    this.searchkit.setResults({
      hits: {
        hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }, { _id: 3 }],
        total: 3
      }
    })
    expect(document.querySelector).toHaveBeenCalledWith('#scrolltome')
    expect(scroll.scrollTop).toBe(0)
  })

  it('getScrollSelector()', () => {
    expect(this.accessor.getScrollSelector()).toBe('#scrolltome')
    this.accessor.options.scrollTo = true
    expect(this.accessor.getScrollSelector()).toBe('body')
  })
})
