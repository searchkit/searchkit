import * as _ from 'lodash'
import {
  ImmutableQuery,
  BoolMust,
  BoolShould,
  TermQuery,
  TermsBucket,
  FilterBucket,
  SimpleQueryString,
  Utils
} from '../../../'

describe('ImmutableQuery', () => {
  beforeEach(() => {
    this.query = new ImmutableQuery()

    this.addFilter = () =>
      this.query.addFilter('genres', BoolShould([TermQuery('genres', 'comedy')]))

    this.addQuery = () => this.query.addQuery(SimpleQueryString('foo'))
  })

  afterEach(() => {
    //check immutability
    expect(this.query.query).toEqual({
      size: 0
    })
    expect(this.query.index).toEqual({
      queryString: '',
      filtersMap: {},
      filters: [],
      selectedFilters: [],
      queries: [],
      size: 0,
      _source: null
    })
  })

  it('hasFilters()', () => {
    expect(this.query.hasFilters()).toBe(false)
    const query = this.addFilter()
    expect(query.hasFilters()).toBe(true)
    // immutability check
    expect(this.query.hasFilters()).toBe(false)
  })

  it('hasFiltersOrQuery()', () => {
    expect(this.query.hasFiltersOrQuery()).toBe(false)
    const query = this.addFilter()
    expect(query.hasFiltersOrQuery()).toBe(true)
    const query2 = this.addQuery()
    expect(query2.hasFiltersOrQuery()).toBe(true)
    expect(this.query.setSort(1).hasFiltersOrQuery()).toBe(true)
  })

  it('addQuery()', () => {
    const query = this.addQuery()
    expect(query.query.query).toEqual(SimpleQueryString('foo'))
    const unchangedQuery = new ImmutableQuery()
    expect(unchangedQuery.addQuery(null)).toBe(unchangedQuery)
  })

  it('supports multiple queries added', () => {
    let query = this.addQuery()
    query = query.addQuery(BoolMust(TermQuery('active', true)))
    query = query.addQuery(BoolMust([TermQuery('published', true), TermQuery('archived', false)]))
    expect(query.query.query).toEqual({
      bool: {
        must: [
          {
            simple_query_string: {
              query: 'foo'
            }
          },
          {
            term: {
              active: true
            }
          },
          {
            term: {
              published: true
            }
          },
          {
            term: {
              archived: false
            }
          }
        ]
      }
    })
  })

  it('setQueryString()', () => {
    const query = this.query.setQueryString('foo')
    expect(query.index.queryString).toBe('foo')
  })

  it('getQueryString()', () => {
    const query = this.query.setQueryString('foo')
    expect(query.getQueryString()).toBe('foo')
  })

  it('addAnonymousFilter()', () => {
    const mockId = '123'
    spyOn(Utils, 'guid').and.returnValue(mockId)
    const filter = BoolShould([1])
    const query = this.query.addAnonymousFilter(filter)

    expect(query.query.post_filter).toEqual(filter)
    expect(query.index.filtersMap).toEqual({
      [mockId]: filter
    })
  })

  it('addFilter()', () => {
    const filter = BoolShould([1])
    const query = this.query.addFilter('someKey', filter)

    expect(query.query.post_filter).toEqual(filter)
    expect(query.index.filtersMap).toEqual({
      someKey: filter
    })
  })

  describe('SelectedFilter', () => {
    beforeEach(() => {
      this.filter = {
        id: 'foo',
        name: 'Bar',
        value: 'someValue',
        remove: _.identity
      }
    })
    it('addSelectedFilter()', () => {
      const query = this.query.addSelectedFilter(this.filter)
      expect(query.index.selectedFilters).toEqual([this.filter])
    })
    it('addSelectedFilters()', () => {
      const query = this.query.addSelectedFilters([this.filter])
      expect(query.index.selectedFilters).toEqual([this.filter])
    })

    it('getSelectedFilters()', () => {
      const query = this.query.addSelectedFilters([this.filter, this.filter])
      expect(query.getSelectedFilters()).toEqual([this.filter, this.filter])
    })
  })

  it('setAggs()', () => {
    const genreAggs = FilterBucket('genre_filter', {}, TermsBucket('genre_terms', 'genre'))
    const authorAggs = FilterBucket('author_filter', {}, TermsBucket('author_terms', 'author'))

    const query = this.query.setAggs(genreAggs).setAggs(authorAggs)
    expect(query.query.aggs).toEqual({
      genre_filter: {
        filter: { match_all: {} },
        aggs: {
          genre_terms: {
            terms: {
              field: 'genre'
            }
          }
        }
      },
      author_filter: {
        filter: { match_all: {} },
        aggs: {
          author_terms: {
            terms: {
              field: 'author'
            }
          }
        }
      }
    })
  })

  it('getFilters()', () => {
    const aFilter = BoolShould(['a'])
    const bFilter = BoolShould(['b'])
    const cFilter = BoolShould(['c'])
    const query = this.query
      .addFilter('a', aFilter)
      .addFilter('b', bFilter)
      .addFilter('c', cFilter)

    expect(query.getFilters()).toEqual(BoolMust([aFilter, bFilter, cFilter]))
    expect(query.getFilters('d')).toEqual(BoolMust([aFilter, bFilter, cFilter]))
    expect(query.getFilters('a')).toEqual(BoolMust([bFilter, cFilter]))
    expect(query.getFilters('b')).toEqual(BoolMust([aFilter, cFilter]))

    expect(query.getFiltersWithKeys('b')).toEqual(BoolMust([bFilter]))
  })

  it('setSize()', () => {
    const query = this.query.setSize(10)
    expect(query.getSize()).toEqual(10)
  })

  it('setFrom()', () => {
    const query = this.query.setFrom(10)
    expect(query.getFrom()).toEqual(10)
  })

  it('getPage()', () => {
    let query = this.query.setSize(15)
    expect(query.getPage()).toEqual(1)
    query = query.setSize(20)
    expect(query.getPage()).toEqual(1)
    query = query.setFrom(60)
    expect(query.getPage()).toEqual(4)
    // Page should always be an integer
    query = query.setFrom(50)
    expect(query.getPage()).toEqual(3) // floor(3.5)
  })

  it('setHighlight()', () => {
    let query = this.query.setHighlight({
      fields: {
        title: {},
        plot: {}
      }
    })
    query = query.setHighlight({
      fields: {
        description: {}
      }
    })
    expect(query.query.highlight).toEqual({
      fields: {
        title: {},
        plot: {},
        description: {}
      }
    })
  })

  it('setSource()', () => {
    const query = this.query.setSource(['title', 'thumbnail'])
    expect(query.query._source).toEqual(['title', 'thumbnail'])
  })

  it('setSuggestions()', () => {
    const query = this.query.setSuggestions('suggestions')
    expect(query.query.suggest).toBe('suggestions')
  })

  it('getJSON()', () => {
    const query = this.addFilter().addQuery(SimpleQueryString('Hi'))
    expect(query.getJSON()).toEqual({
      query: {
        simple_query_string: {
          query: 'Hi'
        }
      },
      post_filter: {
        term: {
          genres: 'comedy'
        }
      },
      size: 0
    })
  })

  it('printJSON()', () => {
    spyOn(console, 'log')
    this.query.printJSON()
    expect(console.log).toHaveBeenCalledWith(JSON.stringify(this.query.getJSON(), null, 2))
  })
})
