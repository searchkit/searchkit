import * as React from "react";
import {mount} from "enzyme";
import {NoHits} from "../src/NoHits";
import {SearchkitManager} from "../../../../core";
import {
  fastClick
} from "../../../__test__/TestHelpers"

import {InitialLoader} from "../src/InitialLoader";

describe("InitialLoader", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.wrapper = mount(
      <InitialLoader searchkit={this.searchkit}/>
    )
  })

  it("should render correctly", ()=> {
    expect(this.wrapper).toMatchSnapshot("initial loading")
    this.searchkit.initialLoading = false
    this.wrapper = mount(
      <InitialLoader searchkit={this.searchkit} />
    )
    expect(this.wrapper).toMatchSnapshot("no initial loader")
  })

  it("should render a custom component", ()=> {
    let higherOrderComp = ({bemBlocks})=> (
      <p className={bemBlocks.container("foo")}>Loading</p>
    )
    let wrapper = mount(<InitialLoader searchkit={this.searchkit} component={higherOrderComp}/>)
    expect(this.wrapper).toMatchSnapshot()
  })


})
