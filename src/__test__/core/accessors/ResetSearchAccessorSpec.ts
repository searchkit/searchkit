import {
  ResetSearchAccessor, ImmutableQuery, SearchkitManager,
  FilterBasedAccessor
} from "../../../"

describe("ResetSearchAccessor", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.accessor = new ResetSearchAccessor()
    this.searchkit.addAccessor(this.accessor)
    this.query = new ImmutableQuery()
  })

  it("constructor()", ()=> {
    expect(this.accessor.options).toEqual({
      query:true, filter:true
    })
    let accessor = new ResetSearchAccessor({query:true})
    expect(accessor.options).toEqual({
      query:true
    })
  })

  it("canReset()", ()=> {
    let options = {query:true, filter:true}
    this.accessor.options = options
    this.searchkit.query = new ImmutableQuery()
    expect(this.accessor.canReset()).toBe(false)
    this.searchkit.query = new ImmutableQuery().setQueryString("foo")
    expect(this.accessor.canReset()).toBe(true)
    options.query = false
    expect(this.accessor.canReset()).toBe(false)
    this.searchkit.query = new ImmutableQuery().addSelectedFilter({
      id:"foo", name:"fooname", value:"foovalue", remove:()=> {}
    })
    expect(this.accessor.canReset()).toBe(true)
    options.filter = false
    expect(this.accessor.canReset()).toBe(false)
  })

  it("performReset()", ()=> {
    let queryAccessor = this.searchkit.getQueryAccessor()
    spyOn(queryAccessor, "resetState")
    let filterAccessor1 = new FilterBasedAccessor("f1")
    spyOn(filterAccessor1, "resetState")
    let filterAccessor2 = new FilterBasedAccessor("f2")
    spyOn(filterAccessor2, "resetState")
    this.searchkit.addAccessor(filterAccessor1)
    this.searchkit.addAccessor(filterAccessor2)

    this.accessor.options = {query:false, filter:false}
    this.accessor.performReset()
    expect(queryAccessor.resetState).not.toHaveBeenCalled()
    expect(filterAccessor1.resetState).not.toHaveBeenCalled()
    expect(filterAccessor2.resetState).not.toHaveBeenCalled()

    this.accessor.options = {query:true, filter:false}
    this.accessor.performReset()
    expect(queryAccessor.resetState).toHaveBeenCalled()
    expect(filterAccessor1.resetState).not.toHaveBeenCalled()
    expect(filterAccessor2.resetState).not.toHaveBeenCalled()

    this.accessor.options = {query:true, filter:true}
    this.accessor.performReset()
    expect(filterAccessor1.resetState).toHaveBeenCalled()
    expect(filterAccessor2.resetState).toHaveBeenCalled()
  })


})
