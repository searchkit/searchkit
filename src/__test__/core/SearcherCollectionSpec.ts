import {
  Searcher,EventEmitter,ImmutableQuery,SearcherCollection,
  SearchkitManager, PageSizeAccessor, ValueState
} from "../../"

describe("SearcherCollection", ()=> {

  beforeEach(()=> {
    this.searcher1 = new Searcher(null)

    this.accessor1 = new PageSizeAccessor("p1", 10)
    this.accessor2 = new PageSizeAccessor("p2", 20)
    this.searcher1.addAccessor(this.accessor1)
    this.searcher1.addAccessor(this.accessor2)

    this.searcher2 = new Searcher(null)
    this.accessor3 = new PageSizeAccessor("p3", 30)
    this.accessor4 = new PageSizeAccessor("p4", 40)
    this.searcher2.addAccessor(this.accessor3)
    this.searcher2.addAccessor(this.accessor4)
    this.searchers = new SearcherCollection(
      [this.searcher1, this.searcher2])
  })

  it("constructor()", ()=> {
    expect(this.searchers.searchers).toEqual(
      [this.searcher1, this.searcher2])
    expect(new SearcherCollection().searchers)
      .toEqual([])
  })

  it("getAccessors()", ()=> {
    expect(this.searchers.getAccessors()).toEqual([
      this.accessor1, this.accessor2,
      this.accessor3, this.accessor4
    ])
  })

  it("add()", ()=> {
    let searchers = new SearcherCollection()
    expect(searchers.add(this.searcher1))
      .toEqual(this.searcher1)
    expect(searchers.searchers).toEqual([this.searcher1])
  })

  it("size()", ()=> {
    expect(this.searchers.size()).toBe(2)
  })

  it("getState()", ()=> {
    this.accessor1.state = new ValueState("a1state")
    this.accessor4.state = new ValueState("a4state")
    expect(this.searchers.getState()).toEqual({
      p1:"a1state", p4:"a4state"
    })
  })

  it("setAccessorStates()", ()=> {
    this.searchers.setAccessorStates({
      p2:"a2state", p3:"a3state"})
    expect(this.accessor1.state.getValue()).toBe(null)
    expect(this.accessor2.state.getValue()).toBe("a2state")
    expect(this.accessor3.state.getValue()).toBe("a3state")
    expect(this.accessor4.state.getValue()).toBe(null)
  })

  it("notifyStateChange", ()=> {
    let stateChanges = []
    let oldState = {}
    PageSizeAccessor.prototype["onStateChange"] = function(state){
      expect(state).toBe(oldState)
      stateChanges.push(this.key)
    }
    this.searchers.notifyStateChange(oldState)
    expect(stateChanges).toEqual(["p1", "p2", "p3", "p4"])
  })

  it("getChangedSearchers()", ()=> {
    this.searcher2.queryHasChanged = true
    expect(this.searchers.getChangedSearchers())
      .toEqual(new SearcherCollection([this.searcher2]))
  })

  it("buildSharedQuery()", ()=> {
    let query = new ImmutableQuery()
    let sharedQuery = this.searchers.buildSharedQuery(query)
    expect(query).toBe(sharedQuery)
    this.accessor1.buildSharedQuery = function(query){
      return query.setSize(25)
    }
    let newSharedQuery = this.searchers.buildSharedQuery(query)
    expect(newSharedQuery).not.toBe(query)
    expect(newSharedQuery.getSize()).toBe(25)
  })

  it("buildQuery()", ()=> {
    let query = new ImmutableQuery()
    this.searchers.buildQuery(query)
    expect(this.searcher1.query.getSize()).toBe(20)
    expect(this.searcher2.query.getSize()).toBe(40)
  })

  it("getQueries()", ()=> {
    let query = new ImmutableQuery()
    this.searchers.buildQuery(query)
    let queries = this.searchers.getQueries()
    expect(queries.length).toBe(2)
    expect(queries[0].size).toBe(20)
    expect(queries[1].size).toBe(40)
  })

  it("setResponses()", ()=> {
    let responses = [[1,2], [3,4]]
    this.searchers.setResponses(responses)
    expect(this.searcher1.getResults()).toEqual([1,2])
    expect(this.searcher2.getResults()).toEqual([3,4])
  })

  it("setError()", ()=> {
    let error = new Error("oh no")
    this.searchers.setError(error)
    expect(this.searcher1.error).toBe(error)
    expect(this.searcher2.error).toBe(error)
  })

  it("resetState()", ()=> {
    this.accessor1.state = new ValueState("a1state")
    this.accessor3.state = new ValueState("a3state")
    this.searchers.resetState()
    expect(this.accessor1.state.getValue()).toBe(null)
    expect(this.accessor3.state.getValue()).toBe(null)
  })
})
