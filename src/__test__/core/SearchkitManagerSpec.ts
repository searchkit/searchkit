import {
  SearchkitManager, SearcherCollection, Searcher, ESTransport,
  ImmutableQuery, createHistory, PageSizeAccessor, SearchRequest
} from "../../"

describe("SearchkitManager", ()=> {

  beforeEach(()=> {
    this.host = "http://localhost:9200"
    this.searchkit = new SearchkitManager(this.host, {
      multipleSearchers:true,
      useHistory:false,
      httpHeaders:{
        "Content-Type":"application/json"
      },
      basicAuth:"key:val"
    })
    this.searchers = this.searchkit.searchers
  })
  afterEach(()=> {
    this.searchkit.unlistenHistory()
  })

  it("constructor()", ()=> {
    expect(this.searchkit.host).toBe(this.host)
    expect(this.searchkit.searchers)
      .toEqual(jasmine.any(SearcherCollection))
    expect(this.searchkit.registrationCompleted).toEqual(
      jasmine.any(Promise))
    expect(this.searchkit.defaultQueries).toEqual([])
    expect(this.searchkit.translateFunction)
      .toEqual(jasmine.any(Function))
    expect(this.searchkit.multipleSearchers).toBe(true)
    expect(this.searchkit.primarySearcher)
      .toEqual(jasmine.any(Searcher))
    expect(this.searchkit.transport)
      .toEqual(jasmine.any(ESTransport))
    expect(this.searchkit.transport.options.headers).toEqual(
      jasmine.objectContaining({
        "Content-Type":"application/json",
        "Authorization":jasmine.any(String)
      })
    )
  })

  it("addSearcher()", ()=> {
    const searcher = new Searcher(this.searchkit)
    this.searchkit.addSearcher(searcher)
    expect(this.searchkit.searchers.searchers).toEqual([
      this.searchkit.primarySearcher, searcher
    ])
  })

  it("addDefaultQuery()", ()=> {
    const queryFn = ()=> {}
    this.searchkit.addDefaultQuery(queryFn)
    expect(this.searchkit.defaultQueries)
      .toEqual([queryFn])
  })

  it("translate()", ()=> {
    spyOn(this.searchkit, "translateFunction")
      .and.callThrough()
    expect(this.searchkit.translate("foo")).toBe("foo")
    expect(this.searchkit.translateFunction)
      .toHaveBeenCalledWith("foo")
  })

  it("createSearcher()", ()=> {
    this.searchers.searchers = []
    const searcher = this.searchkit.createSearcher()
    expect(this.searchers.searchers)
      .toEqual([searcher])
    expect(searcher.searchkitManager)
      .toBe(this.searchkit)
  })

  it("buildSharedQuery()", ()=> {
    const defaultQueryFn = (query)=> {
      return query.setSize(10)
    }
    this.searchkit.addDefaultQuery(defaultQueryFn)
    this.searchers.buildSharedQuery = (query)=> {
      return query.setFrom(5)
    }
    let sharedQuery = this.searchkit.buildSharedQuery()
    expect(sharedQuery.getSize()).toBe(10)
    expect(sharedQuery.getFrom()).toBe(5)
  })

  it("buildQuery()", ()=> {
    spyOn(this.searchers, "buildQuery")
    const query = new ImmutableQuery()
    this.searchkit.buildSharedQuery = ()=> query
    this.searchkit.buildQuery()
    expect(this.searchers.buildQuery)
      .toHaveBeenCalledWith(query)
  })

  it("resetState()", ()=> {
    spyOn(this.searchers, "resetState")
    this.searchkit.resetState()
    expect(this.searchers.resetState)
      .toHaveBeenCalled()
  })

  it("listenToHistory()", (done)=> {
    const history = createHistory()
    history.pushState(null, window.location.pathname, {
      q:"foo"
    })
    const searchkit = new SearchkitManager("/", {
      useHistory:true
    })
    spyOn(searchkit.searchers, "setAccessorStates")
    spyOn(searchkit, "_search")
    searchkit.completeRegistration()
    setTimeout(()=> {
      expect(searchkit._search).toHaveBeenCalled()
      expect(searchkit.searchers.setAccessorStates)
        .toHaveBeenCalledWith({q:"foo"})
      done()
    }, 0)
  })

  it("performSearch()", ()=> {
    const searchkit = new SearchkitManager("/", {
      useHistory:true
    })
    searchkit.state = {
      q:"foo"
    }
    spyOn(searchkit.searchers, "notifyStateChange")
    spyOn(searchkit, "_search").and.returnValue(true)
    spyOn(searchkit.history, "pushState")
    searchkit.performSearch()
    expect(searchkit.history.pushState).toHaveBeenCalledWith(
      null, jasmine.any(String), {q:"foo"}
    )
  })

  it("search()", ()=> {
    spyOn(this.searchkit, "performSearch")
    this.searchkit.search()
    expect(this.searchkit.performSearch)
      .toHaveBeenCalled()
  })

  it("_search()", ()=> {
    spyOn(SearchRequest.prototype, "run")
    this.accessor = new PageSizeAccessor(10)
    let initialSearchRequest  =
      this.searchkit.currentSearchRequest = new SearchRequest(this.host, null)
    this.searchkit.primarySearcher.addAccessor(
      this.accessor)

    this.searchkit._search()
    expect(initialSearchRequest.active).toBe(false)
    expect(this.searchkit.currentSearchRequest.transport.host)
      .toBe(this.host)
    expect(this.searchkit.currentSearchRequest.searchers)
      .toEqual(this.searchers)
    expect(this.searchkit.currentSearchRequest.run)
      .toHaveBeenCalled()
  })

})
