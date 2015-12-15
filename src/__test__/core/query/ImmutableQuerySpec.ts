import {
  ImmutableQuery,
  BoolMust,
  BoolShould,
  Term,
  Terms,
  SimpleQueryString,
  Utils
} from "../../../"

describe("ImmutableQuery", ()=> {

  beforeEach(()=> {
    this.query = new ImmutableQuery()

    this.addFilter = ()=> {
      return this.query.addFilter("genres", BoolShould([
        Term("genres", "comedy")
      ]))
    }

    this.addQuery = ()=> {
      return this.query.addQuery(SimpleQueryString("foo"))
    }
  })

  afterEach(()=> {
    //check immutability
    expect(this.query.query).toEqual({
      filter:BoolMust([]),
      query:BoolMust([]),
      size:0
    })
    expect(this.query.index).toEqual({
      filters:{}, filtersArray:[]
    })
  })

  it("hasFilters()", ()=> {
    expect(this.query.hasFilters()).toBe(false)
    let query = this.addFilter()
    expect(query.hasFilters()).toBe(true)
    //immutability check
    expect(this.query.hasFilters()).toBe(false)
  })

  it("hasFiltersOrQuery()", ()=> {
    expect(this.query.hasFiltersOrQuery()).toBe(false)
    let query = this.addFilter()
    expect(query.hasFiltersOrQuery()).toBe(true)
    let query2 = this.addQuery()
    expect(query2.hasFiltersOrQuery()).toBe(true)
  })

  it("addQuery()", ()=> {
    let query = this.addQuery()
    expect(query.query.query.$array).toEqual([
      SimpleQueryString("foo")
    ])
  })

  it("addHiddenFilter()", ()=> {
    let mockId = "123"
    let spy = spyOn(Utils, "guid").and.returnValue(mockId)
    let filter = BoolShould([1])
    let query = this.query.addHiddenFilter(filter)

    expect(query.query.filter.$array)
      .toEqual([filter])
    expect(query.index).toEqual({
      filters:{
        [mockId]:filter
      },
      filtersArray:[1]
    })
  })

  it("addFilter()", ()=> {
    let filter = BoolShould([1])
    let query = this.query.addFilter("someKey", filter)

    expect(query.query.filter.$array)
      .toEqual([filter])
    expect(query.index).toEqual({
      filters:{
        someKey:filter
      },
      filtersArray:[1]
    })

  })

  it("getFiltersArray()", ()=> {
    expect(this.query.getFiltersArray())
      .toBe(this.query.index.filtersArray)
  })

  it("setAggs()", ()=> {
    let aggs = {
      "genre":{
        filter:{},
        aggs:{
          "genre":Terms("genre", {})
        }
      }
    }
    let query = this.query.setAggs(aggs)
    expect(query.query.aggs).toEqual(aggs)

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
  })

  it("setSize()", ()=> {
    let query = this.query.setSize(10)
    expect(query.getSize()).toEqual(10)
  })

  it("setFrom()", ()=> {
    let query = this.query.setFrom(10)
    expect(query.getFrom()).toEqual(10)
  })

  it("areQueriesDifferent()", ()=> {
    let query1 = new ImmutableQuery()
      .addQuery(SimpleQueryString("foo"))
    let query2 = new ImmutableQuery()
      .addQuery(SimpleQueryString("bar"))

    let query3 = new ImmutableQuery()
      .addQuery(SimpleQueryString("bar"))

    expect(ImmutableQuery.areQueriesDifferent(
      query1, query2)).toBe(true)

    expect(ImmutableQuery.areQueriesDifferent(
      query2, query3)).toBe(false)
  })

  it("getJSON()", ()=> {
    let query = this.addFilter()
      .addQuery(SimpleQueryString("Hi"))
    expect(query.getJSON()).toEqual({
      "filter": {
        "bool": {
          "must": [{
            "bool": {
              "should": [{
                "term": {
                  "genres": "comedy"
                }
              }]
            }
          }]
        }
      },
      "query": {
        "bool": {
          "must": [{
            "simple_query_string": {
              "query": "Hi"
            }
          }]
        }
      },
      "size":0
    })
  })

})
