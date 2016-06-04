import * as React from "react";

import {
  SearchkitProvider,
  SearchkitManager,
  SearchkitComponent
} from "../../../"

import {mount} from "enzyme";

describe("SearchkitProvider", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    class SomeComponent extends SearchkitComponent<any, any> {

      render(){
        return <h1>Hello</h1>
      }
    }
    this.wrapper = mount(
      <SearchkitProvider searchkit={this.searchkit}>
        <SomeComponent/>
      </SearchkitProvider>
    )
  })

  it("searchkit provider should work correctly", ()=> {
    expect(this.wrapper.html()).toBe("<h1>Hello</h1>")
    expect(this.wrapper.node.props.searchkit)
      .toBe(this.searchkit)
  })

  it("should call setupListeners()", ()=> {
    spyOn(this.searchkit, "setupListeners")
    expect(this.searchkit.setupListeners).not.toHaveBeenCalled()
    this.wrapper.node.componentWillMount()
    expect(this.searchkit.setupListeners).toHaveBeenCalled()
    this.searchkit.unlistenHistory = jasmine.createSpy("unlisten")
    this.wrapper.node.componentWillUnmount()
    expect(this.searchkit.unlistenHistory).toHaveBeenCalled()
  })


})
