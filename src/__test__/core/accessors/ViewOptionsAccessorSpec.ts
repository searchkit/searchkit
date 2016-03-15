import {
  ViewOptionsAccessor,
  SearchkitManager,
  ImmutableQuery
} from "../../../"

describe("ViewOptionsAccessor", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.accessor = new ViewOptionsAccessor("view",[
        {key:"grid"},
        {key:"list", defaultOption:true}
    ])
    this.searchkit.addAccessor(this.accessor)
    spyOn(this.searchkit, "performSearch")

  })

  it("should set view", () => {
    this.accessor.setView("grid")
    expect(this.accessor.state.getValue()).toBe("grid")
    expect(this.searchkit.performSearch).toHaveBeenCalledWith(false, false)
  })

  it("should set view - default option", () => {
    this.accessor.setView("list")
    expect(this.accessor.state.getValue()).toBe(null)
    expect(this.searchkit.performSearch).toHaveBeenCalledWith(false, false)

  })


})
