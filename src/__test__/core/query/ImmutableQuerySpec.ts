import {
  ImmutableQuery,
  BoolMust,
  BoolShould,
  TermQuery,
  TermsBucket,
  FilterBucket,
  SimpleQueryString,
  SelectedFilter,
  Utils
} from "../../../"

import * as _ from "lodash"


describe("ImmutableQuery", ()=> {

  beforeEach(()=> {
    this.query = new ImmutableQuery()

    this.addFilter = ()=> {
      return this.query.addFilter("genres", BoolShould([
        TermQuery("genres", "comedy")
      ]))
    }

    this.addQuery = ()=> {
      return this.query.addQuery(SimpleQueryString("foo"))
    }
  })

  afterEach(()=> {
    //check immutability
    expect(this.query.query).toEqual({
      size:0
    })
    expect(this.query.index).toEqual({
      queryString:"",
      filtersMap:{},
      filters:[],
      selectedFilters:[],
      queries:[],
      size:0,
      _source:null
    })
  })

  it("hasFilters()", ()=> {
    expect(this.query.hasFilters()).toBe(false)
    let query = this.addFilter()
    expect(query.hasFilters()).toBe(true)
    // immutability check
    expect(this.query.hasFilters()).toBe(false)
  })

  it("hasFiltersOrQuery()", ()=> {
    expect(this.query.hasFiltersOrQuery()).toBe(false)
    let query = this.addFilter()
    expect(query.hasFiltersOrQuery()).toBe(true)
    let query2 = this.addQuery()
    expect(query2.hasFiltersOrQuery()).toBe(true)
    expect(this.query.setSort(1).hasFiltersOrQuery())
      .toBe(true)
  })

  it("addQuery()", ()=> {
    let query = this.addQuery()
    expect(query.query.query).toEqual(
      SimpleQueryString("foo")
    )
    let unchangedQuery = new ImmutableQuery()
    expect(unchangedQuery.addQuery(null))
      .toBe(unchangedQuery)
  })

  it("setQueryString()", ()=> {
    let query = this.query.setQueryString("foo")
    expect(query.index.queryString).toBe("foo")
  })

  it("getQueryString()", ()=> {
    let query = this.query.setQueryString("foo")
    expect(query.getQueryString()).toBe("foo")
  })

  it("addAnonymousFilter()", ()=> {
    let mockId = "123"
    let spy = spyOn(Utils, "guid").and.returnValue(mockId)
    let filter = BoolShould([1])
    let query = this.query.addAnonymousFilter(filter)

    expect(query.query.post_filter).toEqual(filter)
    expect(query.index.filtersMap).toEqual({
      [mockId]:filter
    })
  })

  it("addFilter()", ()=> {
    let filter = BoolShould([1])
    let query = this.query.addFilter("someKey", filter)

    expect(query.query.post_filter)
      .toEqual(filter)
    expect(query.index.filtersMap).toEqual({
      someKey:filter
    })

  })

  describe("SelectedFilter", ()=> {
    beforeEach(()=> {
      this.filter = {
        id:"foo",
        name:"Bar",
        value:"someValue",
        remove:_.identity
      }
    })
    it("addSelectedFilter()", ()=> {
      let query = this.query.addSelectedFilter(this.filter)
      expect(query.index.selectedFilters).toEqual(
        [this.filter] )
    })
    it("addSelectedFilters()", ()=> {
      let query = this.query.addSelectedFilters([this.filter])
      expect(query.index.selectedFilters).toEqual(
        [this.filter] )
    })

    it("getSelectedFilters()", ()=> {
      let query = this.query.addSelectedFilters(
        [this.filter, this.filter])
      expect(query.getSelectedFilters()).toEqual([
        this.filter, this.filter
      ])
    })
  })

  it("setAggs()", ()=> {
    let genreAggs = FilterBucket("genre_filter", {},
      TermsBucket("genre_terms", "genre")
    )
    let authorAggs = FilterBucket("author_filter", {},
      TermsBucket("author_terms", "author")
    )


    let query = this.query.setAggs(genreAggs).setAggs(authorAggs)
    expect(query.query.aggs).toEqual({
      "genre_filter": {
        "filter": {},
        "aggs": {
          "genre_terms": {
            "terms": {
              "field": "genre"
            }
          }
        }
      },
      "author_filter": {
        "filter": {},
        "aggs": {
          "author_terms": {
            "terms": {
              "field": "author"
            }
          }
        }
      }
    })

  })

  it("getFilters()", ()=> {
    let aFilter = BoolShould(["a"])
    let bFilter = BoolShould(["b"])
    let cFilter = BoolShould(["c"])
    let query = this.query
      .addFilter("a", aFilter)
      .addFilter("b", bFilter)
      .addFilter("c", cFilter)

    expect(query.getFilters())
      .toEqual(BoolMust([aFilter, bFilter, cFilter]))
    expect(query.getFilters("d"))
      .toEqual(BoolMust([aFilter, bFilter, cFilter]))
    expect(query.getFilters("a"))
      .toEqual(BoolMust([bFilter, cFilter]))
    expect(query.getFilters("b"))
      .toEqual(BoolMust([aFilter, cFilter]))

    expect(query.getFiltersWithKeys("b"))
      .toEqual(BoolMust([bFilter]))
  })

  it("setSize()", ()=> {
    let query = this.query.setSize(10)
    expect(query.getSize()).toEqual(10)
  })

  it("setFrom()", ()=> {
    let query = this.query.setFrom(10)
    expect(query.getFrom()).toEqual(10)
  })

  it("getPage()", ()=> {
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

  it("setHighlight()", ()=> {
    let query = this.query.setHighlight({
      "fields": {
          "title":{},
          "plot":{}
      }
    })
    query = query.setHighlight({
      "fields": {
        "description":{}
      }
    })
    expect(query.query.highlight).toEqual(
      {
        "fields": {
            "title":{},
            "plot":{},
            "description":{}
        }
      }
    )

  })

  it("setSource()", ()=> {
    let query = this.query.setSource(["title", "thumbnail"])
    expect(query.query._source).toEqual(["title", "thumbnail"])
  })

  it("setSuggestions()", ()=> {
    let query = this.query.setSuggestions("suggestions")
    expect(query.query.suggest).toBe("suggestions")
  })

  it("getJSON()", ()=> {
    let query = this.addFilter()
      .addQuery(SimpleQueryString("Hi"))
    expect(query.getJSON()).toEqual({
      "query": {
        "simple_query_string": {
          "query": "Hi"
        }
      },
      "post_filter": {
        "term": {
          "genres": "comedy"
        }
      },
      "size": 0
    })
  })

  it("printJSON()", ()=> {
    spyOn(console, "log")
    this.query.printJSON()
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(this.query.getJSON(), null, 2)
    )
  })

})
