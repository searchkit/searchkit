import {
  SearchkitManager, AccessorManager, ESTransport, AxiosESTransport,
  ImmutableQuery, createHistoryInstance, PageSizeAccessor, SearchRequest,
  EventEmitter, QueryAccessor, AnonymousAccessor, MockESTransport
} from "../../"

import * as _ from "lodash"

describe("SearchkitManager", ()=> {

  beforeEach(()=> {
    this.host = "http://localhost:9200"
    spyOn(SearchkitManager.prototype, "runInitialSearch").and.callThrough()
    this.searchkit = new SearchkitManager(this.host, {
      useHistory:false,
      httpHeaders:{
        "Content-Type":"application/json"
      },
      basicAuth:"key:val",
      searchUrlPath:"/search",
      searchOnLoad:false
    })
    this.searchkit.setupListeners()
    this.emitterSpy = jasmine.createSpy("emitter")
    this.searchkit.emitter.addListener(this.emitterSpy)
    this.accessors = this.searchkit.accessors
    expect(this.searchkit.transport.options.searchUrlPath)
      .toBe("/search")
    expect(SearchkitManager.prototype.runInitialSearch)
      .toHaveBeenCalled()

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
        "Content-Type":"application/json"
      })
    )
    expect(this.searchkit.transport.axios.defaults.auth).toEqual(
      jasmine.objectContaining({
        "username":"key",
        "password":"val"
      })
    )
    expect(this.searchkit.query).toEqual(new ImmutableQuery())
    expect(this.searchkit.emitter).toEqual(
      jasmine.any(EventEmitter)
    )
    expect(this.searchkit.options.searchOnLoad).toBe(false)
    expect(this.searchkit.initialLoading).toBe(true)
    //check queryProcessor is an identity function
    expect(this.searchkit.queryProcessor("query")).toBe("query")
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
    const history = createHistoryInstance()
    history.push(window.location.pathname + "?q=foo")
    SearchkitManager.prototype.unlistenHistory = jasmine.createSpy("unlisten")
    const searchkit = new SearchkitManager("/", {
      useHistory:true
    })
    searchkit.setupListeners()
    expect(SearchkitManager.prototype.unlistenHistory)
      .toHaveBeenCalled()
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

  it("listenToHistory() - searchOnLoad false", (done)=> {
    const history = createHistoryInstance()
    history.push(window.location.pathname + "?q=foo-previous")
    history.push(window.location.pathname + "?q=foo-now")
    setTimeout(()=> {
      const searchkit = new SearchkitManager("/", {
        useHistory:true,
        searchOnLoad:false
      })
      searchkit.setupListeners()
      spyOn(searchkit.accessors, "setState")
      spyOn(searchkit, "searchFromUrlQuery")
      searchkit.completeRegistration()
      setTimeout(()=> {
        history.goBack()
        setTimeout(()=> {
          expect(searchkit.searchFromUrlQuery).toHaveBeenCalledWith({q:"foo-previous"})
          searchkit.unlistenHistory()
          done()
        },0)
      },0)
    }, 0)

  })

  it("listenToHistory() - handle error", (done)=> {
    const history = createHistoryInstance()
    history.push(window.location.pathname + "?q=foo")
    const searchkit = new SearchkitManager("/", {
      useHistory:true
    })
    searchkit.setupListeners()

    searchkit.searchFromUrlQuery = (query)=> {
      throw new Error("oh no")
    }
    spyOn(console, "error")
    searchkit.completeRegistration()
    setTimeout(()=> {
      expect(console.error["calls"].argsFor(0)[0])
        .toContain("searchFromUrlQuery")
      searchkit.unlistenHistory()
      done()
    }, 0)
  })

  it("performSearch()", ()=> {
    const searchkit = new SearchkitManager("/", {
      useHistory:true
    })
    searchkit.setupListeners()
    searchkit.state = {
      q:"foo"
    }
    spyOn(searchkit.accessors, "notifyStateChange")
    spyOn(searchkit, "_search").and.returnValue(true)
    spyOn(searchkit.history, "push")
    searchkit.performSearch()
    expect(searchkit.history.push).toHaveBeenCalledWith(
      "/context.html?q=foo"
    )
    expect(searchkit.accessors.notifyStateChange)
      .toHaveBeenCalledWith(searchkit.state)
    searchkit.unlistenHistory()
  })

  it("run initial search", (done)=> {
    let searchkit = new SearchkitManager(this.host, {
      useHistory:false, searchOnLoad:false
    })
    spyOn(searchkit, "_search")
    expect(SearchkitManager.prototype.runInitialSearch)
      .toHaveBeenCalled()
    searchkit.completeRegistration()
    setTimeout(()=> {
      expect(searchkit._search).not.toHaveBeenCalled()
      searchkit.options.searchOnLoad = true
      searchkit.runInitialSearch()
      setTimeout(()=> {
        expect(searchkit._search).toHaveBeenCalled()
        done()
      })
    })

  })



  it("performSearch() - same state + replaceState", ()=> {
    const searchkit = new SearchkitManager("/", {
      useHistory:true
    })
    searchkit.setupListeners()
    searchkit.state = {
      q:"foo"
    }
    searchkit.accessors.getState = ()=>{
      return {q:"foo"}
    }
    spyOn(searchkit.accessors, "notifyStateChange")
    spyOn(searchkit, "_search").and.returnValue(true)
    spyOn(searchkit.history, "replace")
    searchkit.performSearch(true)
    expect(searchkit.history.replace)
      .toHaveBeenCalled()
    expect(searchkit.accessors.notifyStateChange)
      .not.toHaveBeenCalled()
    searchkit.unlistenHistory()
    searchkit.state={q:"bar"}
    searchkit.performSearch(true, false)
    expect(searchkit.accessors.notifyStateChange)
      .not.toHaveBeenCalled()
    searchkit.performSearch(true, true)
    expect(searchkit.accessors.notifyStateChange)
      .toHaveBeenCalled()
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
    this.searchkit.setQueryProcessor((query)=> {
      query.source=true
      return query
    })
    let initialSearchRequest  =
      this.searchkit.currentSearchRequest = new SearchRequest(this.host, null, this.searchkit)
    this.searchkit.addAccessor(
      this.accessor)

    this.searchkit._search()
    expect(initialSearchRequest.active).toBe(false)
    expect(this.searchkit.currentSearchRequest.transport.host)
      .toBe(this.host)
    expect(this.searchkit.currentSearchRequest.query).toEqual({
      size: 10, source: true
    })
    expect(this.searchkit.currentSearchRequest.run)
      .toHaveBeenCalled()
    expect(this.searchkit.loading).toBe(true)
  })

  it("_search() should not search with same query", ()=> {
    spyOn(SearchRequest.prototype, "run")
    this.searchkit.query = new ImmutableQuery().setSize(20).setSort([{"created":"desc"}])
    this.searchkit.buildQuery = ()=> new ImmutableQuery().setSize(20).setSort([{"created":"desc"}])
    this.searchkit._search()
    expect(SearchRequest.prototype.run)
      .not.toHaveBeenCalled()

    this.searchkit.query = new ImmutableQuery().setSize(21)
    this.searchkit._search()
    expect(SearchRequest.prototype.run)
      .toHaveBeenCalled()
  })

  it("reloadSearch()", ()=> {
    spyOn(SearchRequest.prototype, "run")
    this.searchkit.query = new ImmutableQuery().setSize(20).setSort([{"created":"desc"}])
    this.searchkit.buildQuery = ()=> new ImmutableQuery().setSize(20).setSort([{"created":"desc"}])
    this.searchkit._search()
    expect(SearchRequest.prototype.run)
      .not.toHaveBeenCalled()
    this.searchkit.reloadSearch()
    expect(SearchRequest.prototype.run)
      .toHaveBeenCalled()
  })

  it("setResults()", ()=> {
    spyOn(this.accessors, "setResults")
    spyOn(this.searchkit, "onResponseChange")
    expect(this.searchkit.results).toBe(undefined)
    let resultsSpy = jasmine.createSpy("results")
    let removalFn = this.searchkit.addResultsListener(resultsSpy)
    expect(removalFn).toEqual(jasmine.any(Function))
    this.searchkit.setResults("foo")
    expect(this.searchkit.results).toBe("foo")
    expect(this.accessors.setResults)
      .toHaveBeenCalledWith("foo")
    expect(this.searchkit.onResponseChange)
      .toHaveBeenCalled()
    expect(resultsSpy).toHaveBeenCalledWith("foo")

  })

  it("setResults() - error", ()=> {
    spyOn(this.searchkit, "onResponseChange")
    spyOn(this.accessors, "setResults")
    spyOn(console, "error")
    expect(this.searchkit.results).toBe(undefined)
    let error = new Error("oh no")
    this.searchkit.setError(error)
    expect(this.searchkit.error).toBe(error)
    expect(console.error).toHaveBeenCalledWith(error)
    expect(this.searchkit.results).toBe(null)
    expect(this.accessors.setResults)
      .toHaveBeenCalledWith(null)
    expect(this.searchkit.onResponseChange)
      .toHaveBeenCalled()
  })

  it("setResults() - change detection", ()=> {
    spyOn(this.accessors, "setResults")
    spyOn(this.searchkit, "onResponseChange")
    let results = {
      hits:{
        total:2,
        hits:[
          {_id:1, _source:{title:"Doc1"}},
          {_id:2, _source:{title:"Doc2"}}
        ]
      }
    }
    this.searchkit.setResults(_.cloneDeep(results))
    expect(this.searchkit.results.hits.ids).toBe("1,2")
    expect(this.searchkit.results.hits.hasChanged).toBe(true)
    expect(this.searchkit.hasHitsChanged()).toBe(true)

    this.searchkit.setResults(_.cloneDeep(results))
    expect(this.searchkit.hasHitsChanged()).toBe(false)
    results.hits.hits.push({_id:3, _source:{title:"Doc3"}})
    this.searchkit.setResults(_.cloneDeep(results))
    expect(this.searchkit.results.hits.ids).toBe("1,2,3")
    expect(this.searchkit.hasHitsChanged()).toBe(true)


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
      },
      took:1
    }
    expect(this.searchkit.getHitsCount()).toBe(99)
    expect(this.searchkit.getTime()).toBe(1)
    expect(this.searchkit.hasHits()).toBe(true)
  })

  it("getQueryAccessor()", ()=> {
    let queryAccessor = new QueryAccessor("q")
    this.searchkit.addAccessor(queryAccessor)
    expect(this.searchkit.getQueryAccessor()).toBe(queryAccessor)
  })

  it("getAccessorsByType(), getAccessorByType()", ()=> {
    let queryAccessor = new QueryAccessor("q")
    this.searchkit.addAccessor(queryAccessor)
    expect(this.searchkit.getAccessorsByType(QueryAccessor))
      .toEqual([queryAccessor])
    expect(this.searchkit.getAccessorByType(QueryAccessor))
      .toEqual(queryAccessor)
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
