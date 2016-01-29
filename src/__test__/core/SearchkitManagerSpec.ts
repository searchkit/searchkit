import {
  SearchkitManager, AccessorManager, ESTransport, AxiosESTransport,
  ImmutableQuery, createHistory, PageSizeAccessor, SearchRequest,
  EventEmitter, QueryAccessor, AnonymousAccessor, MockESTransport
} from "../../"

describe("SearchkitManager", ()=> {

  beforeEach(()=> {
    this.host = "http://localhost:9200"
    this.searchkit = new SearchkitManager(this.host, {
      useHistory:false,
      httpHeaders:{
        "Content-Type":"application/json"
      },
      basicAuth:"key:val"
    })
    this.emitterSpy = jasmine.createSpy("emitter")
    this.searchkit.emitter.addListener(this.emitterSpy)
    this.accessors = this.searchkit.accessors

  })


  it("constructor()", ()=> {
    let semverRegex = /^\d+\.\d+\.\d+-?\w*$/
    expect(this.searchkit.VERSION).toMatch(semverRegex)
    expect(SearchkitManager.VERSION).toMatch(semverRegex)
    expect(this.searchkit.host).toBe(this.host)
    expect(this.searchkit.accessors)
      .toEqual(jasmine.any(AccessorManager))
    expect(this.searchkit.registrationCompleted).toEqual(
      jasmine.any(Promise))
    expect(this.searchkit.translateFunction)
      .toEqual(jasmine.any(Function))
    expect(this.searchkit.transport)
      .toEqual(jasmine.any(AxiosESTransport))
    expect(this.searchkit.transport.options.headers).toEqual(
      jasmine.objectContaining({
        "Content-Type":"application/json",
        "Authorization":jasmine.any(String)
      })
    )
    expect(this.searchkit.query).toEqual(new ImmutableQuery())
    expect(this.searchkit.emitter).toEqual(
      jasmine.any(EventEmitter)
    )
    expect(this.searchkit.initialLoading).toBe(true)
  })

  it("SearchkitManager.mock()", ()=> {
    let searchkit = SearchkitManager.mock()
    expect(searchkit.host).toBe("/")
    expect(searchkit.options.useHistory).toBe(false)
    expect(searchkit.options.transport).toEqual(
      jasmine.any(MockESTransport)
    )
  })

  it("addAccessor(), removeAddAccessor()", ()=> {
    const accessor = new PageSizeAccessor(10)
    this.searchkit.addAccessor(accessor)
    expect(this.searchkit.accessors.accessors).toEqual([
      accessor
    ])
    this.searchkit.removeAccessor(accessor)
    expect(this.searchkit.accessors.accessors)
      .toEqual([])
  })

  it("addDefaultQuery()", ()=> {
    const queryFn = (query)=> {
      return query.setSize(11)
    }
    this.searchkit.addDefaultQuery(queryFn)
    let anonymousAccessor = this.searchkit.accessors.accessors[0]
    expect(this.searchkit.buildQuery().getSize()).toBe(11)
  })

  it("translate()", ()=> {
    spyOn(this.searchkit, "translateFunction")
      .and.callThrough()
    expect(this.searchkit.translate("foo")).toBe(undefined)
    expect(this.searchkit.translateFunction)
      .toHaveBeenCalledWith("foo")
  })

  it("buildQuery()", ()=> {
    const defaultQueryFn = (query)=> {
      return query.setFrom(20)
    }
    this.searchkit.addDefaultQuery(defaultQueryFn)
    this.searchkit.addAccessor(new PageSizeAccessor(10))
    let query = this.searchkit.buildQuery()
    expect(query.getSize()).toBe(10)
    expect(query.getFrom()).toBe(20)
  })

  it("resetState()", ()=> {
    spyOn(this.accessors, "resetState")
    this.searchkit.resetState()
    expect(this.accessors.resetState)
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
    spyOn(searchkit.accessors, "setState")
    spyOn(searchkit, "_search")
    searchkit.completeRegistration()
    setTimeout(()=> {
      expect(searchkit._search).toHaveBeenCalled()
      expect(searchkit.accessors.setState)
        .toHaveBeenCalledWith({q:"foo"})
      searchkit.unlistenHistory()
      done()
    }, 0)
  })

  it("listenToHistory() - handle error", (done)=> {
    const history = createHistory()
    history.pushState(null, window.location.pathname, {
      q:"foo"
    })
    const searchkit = new SearchkitManager("/", {
      useHistory:true
    })
    searchkit.searchFromUrlQuery = (query)=> {
      throw new Error("oh no")
    }
    spyOn(console, "error")
    searchkit.completeRegistration()
    setTimeout(()=> {
      expect(console.error["calls"].argsFor(0)[0])
        .toContain("Error: oh no")

      searchkit.unlistenHistory()
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
    spyOn(searchkit.accessors, "notifyStateChange")
    spyOn(searchkit, "_search").and.returnValue(true)
    spyOn(searchkit.history, "pushState")
    searchkit.performSearch()
    expect(searchkit.history.pushState).toHaveBeenCalledWith(
      null, jasmine.any(String), {q:"foo"}
    )
    expect(searchkit.accessors.notifyStateChange)
      .toHaveBeenCalledWith(searchkit.state)
    searchkit.unlistenHistory()
  })
  it("performSearch() - same state + replaceState", ()=> {
    const searchkit = new SearchkitManager("/", {
      useHistory:true
    })
    searchkit.state = {
      q:"foo"
    }
    searchkit.accessors.getState = ()=>{
      return {q:"foo"}
    }
    spyOn(searchkit.accessors, "notifyStateChange")
    spyOn(searchkit, "_search").and.returnValue(true)
    spyOn(searchkit.history, "replaceState")
    searchkit.performSearch(true)
    expect(searchkit.history.replaceState)
      .toHaveBeenCalled()
    expect(searchkit.accessors.notifyStateChange)
      .not.toHaveBeenCalled()
    searchkit.unlistenHistory()
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
      this.searchkit.currentSearchRequest = new SearchRequest(this.host, null, this.searchkit)
    this.searchkit.addAccessor(
      this.accessor)

    this.searchkit._search()
    expect(initialSearchRequest.active).toBe(false)
    expect(this.searchkit.currentSearchRequest.transport.host)
      .toBe(this.host)
    expect(this.searchkit.currentSearchRequest.query)
      .toEqual(this.searchkit.query)
    expect(this.searchkit.currentSearchRequest.run)
      .toHaveBeenCalled()
    expect(this.searchkit.loading).toBe(true)
  })

  it("setResults()", ()=> {
    spyOn(this.accessors, "setResults")
    spyOn(this.searchkit, "onResponseChange")
    expect(this.searchkit.results).toBe(undefined)
    this.searchkit.setResults("foo")
    expect(this.searchkit.results).toBe("foo")
    expect(this.accessors.setResults)
      .toHaveBeenCalledWith("foo")
    expect(this.searchkit.onResponseChange)
      .toHaveBeenCalled()
  })

  it("setResults()", ()=> {
    spyOn(this.searchkit, "onResponseChange")
    expect(this.searchkit.results).toBe(undefined)
    let error = new Error("oh no")
    this.searchkit.setError(error)
    expect(this.searchkit.error).toBe(error)
    expect(this.searchkit.onResponseChange)
      .toHaveBeenCalled()
  })

  it("getHits()", ()=> {
    expect(this.searchkit.getHits()).toEqual([])
    this.searchkit.results = {
      hits:{
        hits:[1,2,3,4]
      }
    }
    expect(this.searchkit.getHits()).toEqual([1,2,3,4])
  })

  it("getHitsCount(), hasHits()", ()=> {
    expect(this.searchkit.getHitsCount()).toEqual(0)
    expect(this.searchkit.hasHits()).toBe(false)
    this.searchkit.results = {
      hits:{
        total:99
      }
    }
    expect(this.searchkit.getHitsCount()).toEqual(99)
    expect(this.searchkit.hasHits()).toBe(true)
  })

  it("getQueryAccessor()", ()=> {
    let queryAccessor = new QueryAccessor("q")
    this.searchkit.addAccessor(queryAccessor)
    expect(this.searchkit.getQueryAccessor()).toBe(queryAccessor)
  })

  it("onResponseChange()", ()=> {
    this.searchkit.loading = true
    this.searchkit.initialLoading = true
    this.searchkit.onResponseChange()
    expect(this.searchkit.loading).toBe(false)
    expect(this.searchkit.initialLoading).toBe(false)
    expect(this.emitterSpy).toHaveBeenCalled()

  })
})
