import {
  ResetSearchAccessor, ImmutableQuery, SearchkitManager,
  FilterBasedAccessor, PaginationAccessor, QueryAccessor
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
      query:true, filter:true, pagination:true
    })
    let accessor = new ResetSearchAccessor({query:true})
    expect(accessor.options).toEqual({
      query:true
    })
  })

  it("canReset()", ()=> {
    let options = {query:true, filter:true, pagination:true}
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
    this.searchkit.query = new ImmutableQuery().setFrom(10)
    expect(this.accessor.canReset()).toBe(true)
    options.pagination = false
    expect(this.accessor.canReset()).toBe(false)
  })

  it("performReset()", ()=> {
    let queryAccessor = this.searchkit.getQueryAccessor()
    spyOn(queryAccessor, "resetState")
    let filterAccessor1 = new FilterBasedAccessor("f1")
    spyOn(filterAccessor1, "resetState")
    let filterAccessor2 = new FilterBasedAccessor("f2")
    spyOn(filterAccessor2, "resetState")
    let searchInputAccessor = new QueryAccessor("s", {addToFilters:true})
    searchInputAccessor.state = searchInputAccessor.state.setValue("foo")
    let paginationAccessor = new PaginationAccessor("p")
    spyOn(paginationAccessor, "resetState")
    this.searchkit.addAccessor(filterAccessor1)
    this.searchkit.addAccessor(filterAccessor2)
    this.searchkit.addAccessor(searchInputAccessor)
    this.searchkit.addAccessor(paginationAccessor)
    this.searchkit.query = this.searchkit.buildQuery()
    this.accessor.options = {query:false, filter:false}
    this.accessor.performReset()
    expect(queryAccessor.resetState).not.toHaveBeenCalled()
    expect(filterAccessor1.resetState).not.toHaveBeenCalled()
    expect(filterAccessor2.resetState).not.toHaveBeenCalled()
    expect(searchInputAccessor.state.getValue()).toBe("foo")
    this.accessor.options = {query:true, filter:false}
    this.accessor.performReset()
    expect(queryAccessor.resetState).toHaveBeenCalled()
    expect(filterAccessor1.resetState).not.toHaveBeenCalled()
    expect(filterAccessor2.resetState).not.toHaveBeenCalled()
    expect(searchInputAccessor.state.getValue()).toBe("foo")
    this.accessor.options = {query:true, filter:true}
    this.accessor.performReset()
    expect(filterAccessor1.resetState).toHaveBeenCalled()
    expect(filterAccessor2.resetState).toHaveBeenCalled()
    expect(paginationAccessor.resetState).not.toHaveBeenCalled()
    expect(searchInputAccessor.state.getValue()).toBe(null)
    this.accessor.options = {query:true, filter:true, pagination:true}
    this.accessor.performReset()
    expect(paginationAccessor.resetState).toHaveBeenCalled()
  })


})
