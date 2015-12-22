import {
  Accessor, ValueState, Searcher, ImmutableQuery
} from "../../../"

describe("Accessor", ()=> {

  beforeEach(()=> {
    class SomeAccessor extends Accessor<ValueState> {
      state = new ValueState()
    }

    this.accessor = new SomeAccessor(
      "genres.raw"
    )
    this.searcher = new Searcher()
    this.accessor.setSearcher(this.searcher)
  })

  it("constructor()", ()=> {
    expect(this.accessor.key).toEqual("genres.raw")
    expect(this.accessor.urlKey).toEqual("genres_raw")
  })

  it("setSearcher()", ()=> {
    expect(this.accessor.searcher).toBe(this.searcher)
    expect(this.accessor.state).toBe(this.accessor.resultsState)
  })

  it("translate()", ()=> {
    this.searcher.translate = (key)=> {
      return {a:'b'}[key]
    }
    expect(this.accessor.translate("a")).toBe("b")
  })

  it("onStateChange()", ()=> {
    expect(()=> this.accessor.onStateChange({}))
      .not.toThrow()
  })

  it("fromQueryObject", ()=> {
    let queryObject = {
      genres_raw:[1,2],
      authors_raw:[3,4]
    }
    this.accessor.fromQueryObject(queryObject)
    expect(this.accessor.state.getValue())
      .toEqual([1,2])
  })

  it("getQueryObject()", ()=> {
    this.accessor.state = new ValueState([1,2])
    expect(this.accessor.getQueryObject())
      .toEqual({genres_raw:[1,2]})
  })

  it("getResults()", ()=> {
    this.searcher.results = [1,2]
    expect(this.accessor.getResults()).toEqual([1,2])
  })

  it("setResultsState()", ()=> {
    delete this.accessor.resultsState
    expect(this.accessor.state)
      .not.toBe(this.accessor.resultsState)
    this.accessor.setResultsState()
    expect(this.accessor.state)
      .toBe(this.accessor.resultsState)
  })

  it("resetState()", ()=> {
    this.accessor.state = this.accessor.state.setValue("foo")
    expect(this.accessor.state.getValue()).toBe("foo")
    this.accessor.resetState()
    expect(this.accessor.state.getValue()).toBe(null)
  })

  it("buildSharedQuery", ()=> {
    let query = new ImmutableQuery()
    expect(this.accessor.buildSharedQuery(query))
      .toBe(query)
  })
  it("buildOwnQuery", ()=> {
    let query = new ImmutableQuery()
    expect(this.accessor.buildOwnQuery(query))
      .toBe(query)
  })
})
