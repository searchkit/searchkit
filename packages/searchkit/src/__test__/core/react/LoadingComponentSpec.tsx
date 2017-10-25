import * as React from "react";

import {
  SearchkitManager,
  LoadingComponent
} from "../../../"

import {mount} from "enzyme";

describe("SearchkitProvider", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.wrapper = mount(
      <LoadingComponent searchkit={this.searchkit}>
        <p>loading...</p>
      </LoadingComponent>
    )
  })

  it("display nothing when not loading", ()=> {
    expect(this.wrapper.html()).toBe("<div></div>")
  })

  it("display children when loading", ()=> {
    this.searchkit.loading = true
    this.wrapper.update()
    expect(this.wrapper.html()).toBe("<p>loading...</p>")
  })


})
