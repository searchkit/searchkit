import {
  Accessor,
  Utils,
  SearchkitManager,
  ImmutableQuery
} from "../../../"

describe("Accessor", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    spyOn(Utils, "guid").and.returnValue("some_uuid")
    this.accessor = new Accessor()
    this.query = new ImmutableQuery()
  })

  it("constructor()", ()=> {
    expect(this.accessor.active).toBe(true)
    expect(this.accessor.uuid).toBe("some_uuid")
    expect(this.accessor.refCount).toBe(0)
  })

  it("incrementRef(), decrementRef()", ()=> {
    this.accessor.incrementRef()
    expect(this.accessor.refCount).toBe(1)
    this.accessor.decrementRef()
    expect(this.accessor.refCount).toBe(0)
  })


  it("setActive()", ()=> {
    expect(this.accessor.setActive(false).active)
      .toBe(false)
  })

  it("setSearchkitManager()", ()=> {
    this.accessor.setSearchkitManager(this.searchkit)
    expect(this.accessor.searchkit).toBe(this.searchkit)
  })

  it("translate()", ()=> {
    expect(this.accessor.translate("foo")).toBe("foo")
    this.searchkit.translate = key => key + "_translated"
    this.accessor.setSearchkitManager(this.searchkit)
    expect(this.accessor.translate("foo")).toBe("foo_translated")
  })

  it("set + get results", ()=> {
    this.accessor.setResults("lots of hits")
    expect(this.accessor.getResults()).toBe("lots of hits")
  })

  it("getAggregations()", ()=> {
    expect(this.accessor.getAggregations(["tags", "buckets"], []))
      .toEqual([])

    this.accessor.setResults({
      aggregations:{
        tags:{
          buckets:[1,2,3]
        }
      }
    })
    expect(this.accessor.getAggregations(["tags", "buckets"], []))
      .toEqual([1,2,3])

    expect(this.accessor.getAggregations(["tags", undefined, "buckets"], []))
      .toEqual([1,2,3])

  })

  it("beforeBuildQuery()", ()=> {
    expect(this.accessor.beforeBuildQuery).toEqual(
      jasmine.any(Function)
    )
    expect(this.accessor.beforeBuildQuery()).toEqual(undefined)

  })

  it("buildSharedQuery()", ()=> {
    expect(this.accessor.buildSharedQuery(this.query))
      .toBe(this.query)
  })

  it("buildOwnQuery()", ()=> {
    expect(this.accessor.buildOwnQuery(this.query))
      .toBe(this.query)
  })

})
