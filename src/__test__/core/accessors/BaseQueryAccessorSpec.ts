import {
  BaseQueryAccessor,
  SearchkitManager,
  ValueState
} from "../../../"

describe("BaseQueryAccessor", ()=> {

  beforeEach(()=> {
    this.searchkit = new SearchkitManager("/", {useHistory:false})
    this.accessor = new BaseQueryAccessor("q")
    this.accessor.setSearchkitManager(this.searchkit)
  })

  it("constructor()", ()=> {
    expect(this.accessor.key).toBe("q")
    expect(this.accessor.state.getValue())
      .toBe(null)
  })

  it("keepOnlyQueryState()", ()=> {
    this.accessor.state = new ValueState("foo")
    spyOn(this.accessor, "setQueryString")
    this.accessor.keepOnlyQueryState()
    expect(this.accessor.setQueryString)
      .toHaveBeenCalledWith("foo", true)
  })

  it("setQueryString()", ()=> {
    spyOn(this.searchkit, "resetState")
    this.accessor.setQueryString("bar")
    expect(this.searchkit.resetState)
      .not.toHaveBeenCalled()
    expect(this.accessor.state.getValue()).toBe('bar')
    this.accessor.setQueryString("barreset", true)
    expect(this.searchkit.resetState)
      .toHaveBeenCalled()
    expect(this.accessor.state.getValue()).toBe('barreset')
  })

  it("getQueryString()", ()=> {
    this.accessor.state = new ValueState("hi")
    expect(this.accessor.getQueryString()).toBe("hi")

  })

})
