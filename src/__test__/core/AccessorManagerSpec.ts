import {
  EventEmitter,ImmutableQuery,AccessorManager, QueryAccessor, FacetAccessor, RangeAccessor,
  SearchkitManager, ValueState, PaginationAccessor, noopQueryAccessor, Accessor
} from "../../"

class StatelessPageAccessor extends Accessor {
  constructor(public size:number){
    super()
  }
  buildSharedQuery(query){
    return query.setSize(this.size)
  }
}

describe("AccessorManager", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()

    this.accessor1 = new PaginationAccessor("p1")
    this.accessor2 = new PaginationAccessor("p2")
    this.searchkit.addAccessor(this.accessor1)
    this.searchkit.addAccessor(this.accessor2)

    this.accessor3 = new PaginationAccessor("p3")
    this.accessor4 = new PaginationAccessor("p4")
    this.accessor4b = new PaginationAccessor("p4")
    this.searchkit.addAccessor(this.accessor3)
    this.searchkit.addAccessor(this.accessor4)
    this.searchkit.addAccessor(this.accessor4b)

    this.accessor5 = new StatelessPageAccessor(50)
    this.searchkit.addAccessor(this.accessor5)
    this.accessors = this.searchkit.accessors
  })

  it("constructor()", ()=> {
    expect(this.accessors.accessors).toEqual([
      this.accessor1, this.accessor2,
      this.accessor3, this.accessor4,
      this.accessor5
    ])
    expect(new AccessorManager().accessors)
      .toEqual([])
  })

  it("getAccessors()", ()=> {
    expect(this.accessors.getAccessors()).toEqual([
      this.accessor1, this.accessor2,
      this.accessor3, this.accessor4, this.accessor5
    ])
  })

  it("getActiveAccessors()", ()=> {
    this.accessor2.setActive(false)
    this.accessor3.setActive(false)
    expect(this.accessors.getActiveAccessors()).toEqual([
      this.accessor1, this.accessor4, this.accessor5
    ])
  })

  it("getStatefulAccessors()", ()=> {
    expect(this.accessors.getStatefulAccessors()).toEqual([
      this.accessor1, this.accessor2,
      this.accessor3, this.accessor4
    ])
  })

  it("getAccessorsByType()", ()=> {
    expect(this.accessors.getAccessorsByType(StatelessPageAccessor))
      .toEqual([this.accessor5])
    expect(this.accessors.getAccessorsByType(PaginationAccessor))
      .toEqual([this.accessor1, this.accessor2, this.accessor3, this.accessor4])
  })

  it("getAccessorsByType()", ()=> {
    expect(this.accessors.getAccessorByType(StatelessPageAccessor))
      .toEqual(this.accessor5)
    expect(this.accessors.getAccessorByType(PaginationAccessor))
      .toEqual(this.accessor1)
    expect(this.accessors.getAccessorByType(RangeAccessor))
      .toEqual(undefined)
  })

  it("add(), remove()", ()=> {
    let accessors = new AccessorManager()
    this.accessor1.refCount = 0
    expect(accessors.add(this.accessor1)).toEqual(this.accessor1)
    expect(this.accessor1.refCount).toBe(1)
    expect(accessors.getAccessors()).toEqual([this.accessor1])
    accessors.remove(this.accessor1)
    expect(this.accessor1.refCount).toBe(0)
    expect(accessors.getAccessors()).toEqual([])
  })

  it("adding accessor with same statefulKey then remove", ()=> {
    let accessors = new AccessorManager()
    this.accessor4.refCount = 0
    expect(accessors.add(this.accessor4))
      .toEqual(this.accessor4)
    expect(accessors.add(this.accessor4b))
      .toEqual(this.accessor4)
    expect(accessors.getAccessors())
      .toEqual([this.accessor4])
    expect(accessors.statefulAccessors).toEqual({
      p4:this.accessor4
    })
    accessors.remove(this.accessor4)
    accessors.remove(this.accessor4)
    expect(accessors.getAccessors()).toEqual([])
    expect(accessors.statefulAccessors).toEqual({})
  })

  it("add() - QueryAccessor and then remove", ()=> {
    let accessors = new AccessorManager()
    let queryAccessor = new QueryAccessor("q")
    expect(accessors.add(queryAccessor)).toBe(queryAccessor)
    expect(accessors.getQueryAccessor()).toBe(queryAccessor)
    expect(accessors.getAccessors()).toEqual([queryAccessor])
    expect(()=>accessors.add(queryAccessor)).toThrow(
      new Error("Only a single instance of BaseQueryAccessor is allowed")
    )

    accessors.remove(queryAccessor)
    expect(accessors.getAccessors()).toEqual([])
    expect(accessors.getQueryAccessor()).toBe(noopQueryAccessor)
  })

  it("remove() handle null accessor", ()=> {
    let accessors = new AccessorManager()
    expect(()=> { accessors.remove(undefined)}).not.toThrow()
  })

  it("getState()", ()=> {
    this.accessor1.state = new ValueState("a1state")
    this.accessor4.state = new ValueState("a4state")
    expect(this.accessors.getState()).toEqual({
      p1:"a1state", p4:"a4state"
    })
  })

  it("setState()", ()=> {
    this.accessors.setState({
      p2:"a2state", p3:"a3state"})
    expect(this.accessor1.state.getValue()).toBe(null)
    expect(this.accessor2.state.getValue()).toBe("a2state")
    expect(this.accessor3.state.getValue()).toBe("a3state")
    expect(this.accessor4.state.getValue()).toBe(null)
  })

  it("notifyStateChange", ()=> {
    let stateChanges = []
    let oldState = {}
    spyOn(PaginationAccessor.prototype, "onStateChange")
    this.accessors.notifyStateChange(oldState)
    expect(PaginationAccessor.prototype.onStateChange)
      .toHaveBeenCalledWith(oldState)
    expect(PaginationAccessor.prototype.onStateChange["calls"].count())
      .toBe(4)
  })

  it("buildSharedQuery()", ()=> {
    let query = new ImmutableQuery()
    let sharedQuery = this.accessors.buildSharedQuery(query)
    this.accessor1.buildSharedQuery = query => query.setSize(25)
    this.accessor2.buildSharedQuery = query => query.setSize(26)
    this.accessor2.setActive(false)
    this.accessor5.setActive(false)
    let newSharedQuery = this.accessors.buildSharedQuery(query)
    expect(newSharedQuery).not.toBe(query)
    expect(newSharedQuery.getSize()).toBe(25)
  })

  it("buildQuery()", ()=> {
    spyOn(Accessor.prototype, "beforeBuildQuery")
    expect(this.accessors.buildQuery().getSize())
      .toEqual(50)

    expect(Accessor.prototype.beforeBuildQuery["calls"].count())
      .toBe(5)

    this.accessor5.setActive(false)
    expect(this.accessors.buildQuery().getSize())
      .toBe(0)

  })

  it("setResults()", ()=> {
    this.accessors.setResults("someResults")
    expect(this.accessor1.results).toBe("someResults")
    expect(this.accessor4.results).toBe("someResults")
  })


  it("resetState()", ()=> {
    this.accessor1.state = new ValueState("a1state")
    this.accessor3.state = new ValueState("a3state")
    this.accessors.resetState()
    expect(this.accessor1.state.getValue()).toBe(null)
    expect(this.accessor3.state.getValue()).toBe(null)
  })
})
