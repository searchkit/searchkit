import {
  ViewOptionsAccessor,
  SearchkitManager,
  ImmutableQuery
} from "../../../"

import * as sinon from "sinon";


describe("ViewOptionsAccessor", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.accessor = new ViewOptionsAccessor("view",{})
    this.searchkit.addAccessor(this.accessor)
    this.spy = sinon.spy(this.searchkit, "performSearch")

  })

  it("should set view", () => {
    this.accessor.setView({key:"grid", defaultOption:false})
    expect(this.accessor.state.getValue()).toBe("grid")
    expect(this.spy.calledOnce).toEqual(true)
    expect(this.spy.calledWith(false,false)).toEqual(true)
  })

  it("should set view - default option", () => {
    this.accessor.setView({key:"grid", defaultOption:true})
    expect(this.accessor.state.getValue()).toBe(null)
    expect(this.spy.calledOnce).toEqual(true)
    expect(this.spy.calledWith(false,false)).toEqual(true)
  })


})
