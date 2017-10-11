import * as React from "react";
import {mount} from "enzyme";

import { ItemHistogramList } from "./ItemHistogramList"

import {MockList} from "./MockList";

import {fastClick} from "../../__test__/TestHelpers"

describe("ItemHistogramList Components", ()=> {

  it("should render and behave correctly", ()=> {
    this.wrapper = mount(
      <MockList listComponent={ItemHistogramList}/>
    )

    expect(this.wrapper).toMatchSnapshot()

    this.wrapper.setProps({disabled:true})
    expect(this.wrapper.find(".sk-item-list").hasClass("is-disabled")).toBe(true)
    expect(this.wrapper.find(".sk-item-list-option__count").length).toBe(4)
    this.wrapper.setProps({showCount:false})
    expect(this.wrapper.find(".sk-item-list-option__count").length).toBe(0)

    this.wrapper.setProps({mod:"my-item-list"})
    expect(this.wrapper.find(".my-item-list").length).toBe(1)

    expect(this.wrapper.node.state.toggleItem).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".my-item-list-option").at(2))
    expect(this.wrapper.node.state.toggleItem).toHaveBeenCalledWith("c")
  })

  it("should handle multiselect={false}", () => {
    this.wrapper = mount(
      <MockList listComponent={ItemHistogramList} multiselect={false}/>
    )

    expect(this.wrapper.node.state.toggleItem).not.toHaveBeenCalled()
    expect(this.wrapper.node.state.setItems).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-item-list-option").at(2))
    expect(this.wrapper.node.state.toggleItem).not.toHaveBeenCalled()
    expect(this.wrapper.node.state.setItems).toHaveBeenCalledWith(["c"])
  })

  it("mod + classname can be updated", () => {
    this.wrapper = mount(
      <MockList listComponent={ItemHistogramList}  mod="sk-item-list-updated" className="my-custom-class"/>
    )

    expect(this.wrapper.find(".sk-item-list-updated").hasClass("my-custom-class")).toBe(true)
  })

})
