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


})
