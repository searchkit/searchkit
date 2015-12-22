import {
  Searcher,EventEmitter,ImmutableQuery,
  SearchkitManager, PageSizeAccessor
} from "../../"

describe("Searcher", ()=> {

  beforeEach(()=> {
    this.searchkit = new SearchkitManager("/")
    this.searcher = new Searcher(this.searchkit)
    this.emitterSpy = jasmine.createSpy("emitter")
    this.searcher.emitter.addListener(
      this.emitterSpy)
    this.accessor = new PageSizeAccessor("p", 10)
  })

  it("constructor()", ()=> {
    expect(this.searcher.accessors)
      .toEqual([])
    expect(this.searcher.query)
      .toEqual(jasmine.any(ImmutableQuery))
    expect(this.searcher.emitter)
      .toEqual(jasmine.any(EventEmitter))
    expect(this.searcher.searchkitManager)
      .toBe(this.searchkit)
  })

  it("translate()", ()=> {
    this.searchkit.translateFunction = (key)=> key+"bar"
    expect(this.searcher.translate("foo"))
      .toBe("foobar")
    delete this.searcher.searchkitManager
    expect(this.searcher.translate("foo"))
      .toBe("foo")
  })

  it("hasFiltersOrQuery()", ()=> {
    expect(this.searcher.hasFiltersOrQuery()).toBe(false)
    this.searcher.query = this.searcher.query.setSort("title")
    expect(this.searcher.hasFiltersOrQuery()).toBe(true)
  })

  it("addAccessor()", ()=> {
    this.searcher.addAccessor(this.accessor)
    expect(this.searcher.accessors).toEqual([
      this.accessor
    ])
    expect(this.accessor.searcher)
      .toBe(this.searcher)
  })

  it("clearQuery()", ()=> {
    expect(this.searcher.query).toBeDefined()
    this.searcher.clearQuery()
    expect(this.searcher.query).not.toBeDefined()
  })

  describe("buildQuery()", ()=> {
    beforeEach(()=> {
      spyOn(this.searcher, "beginNewSearch")
      this.sharedQuery = new ImmutableQuery()
        .setSize(10)
      this.searcher.addAccessor(this.accessor)
      this.searcher.query = this.sharedQuery
    })

    it("query not changed", ()=> {
      let newQuery = this.searcher.buildQuery(this.sharedQuery)
      expect(this.searcher.queryHasChanged)
        .toBe(false)
      expect(this.searcher.beginNewSearch)
        .not.toHaveBeenCalled()
      expect(newQuery).toBe(this.searcher.query)
    })

    it("query changed", ()=> {
      this.accessor.size = 20
      let newQuery = this.searcher.buildQuery(this.sharedQuery)
      expect(this.searcher.queryHasChanged).toBe(true)
      expect(this.searcher.beginNewSearch).toHaveBeenCalled()
      expect(this.searcher.query.getSize()).toBe(20)
    })

  })

  it("beginNewSearch()", ()=> {
    this.searcher.error = new Error("oh no")
    this.searcher.beginNewSearch()
    expect(this.searcher.error).toBe(null)
    expect(this.searcher.loading).toBe(true)
    expect(this.emitterSpy).toHaveBeenCalled()
  })

  it("getResults()", ()=> {
    this.searcher.setResults([1,2,3])
    expect(this.searcher.getResults())
      .toEqual([1,2,3])
  })

  it("setResults()", ()=> {
    spyOn(this.accessor, "setResultsState")
    this.searcher.addAccessor(this.accessor)
    this.searcher.loading = true
    this.searcher.setResults([1,2,3])
    expect(this.searcher.results).toEqual([1,2,3])
    expect(this.searcher.loading).toBe(false)
    expect(this.accessor.setResultsState)
      .toHaveBeenCalled()
    expect(this.emitterSpy).toHaveBeenCalled()
  })

  it("setError()", ()=> {
    let error = new Error("oh no")
    this.searcher.loading = true
    this.searcher.setError(error)
    expect(this.searcher.error).toBe(error)
    expect(this.searcher.loading).toBe(false)
    expect(this.emitterSpy).toHaveBeenCalled()
  })
})
