import * as React from "react";
import {mount} from "enzyme";

import { TagCloud } from "./TagCloud"
import { MockList } from "./MockList"

import {fastClick} from "../../__test__/TestHelpers"

describe("TagCloud", ()=> {


  it("should render and behave correctly", ()=> {
    this.wrapper = mount(
      <MockList listComponent={TagCloud}/>
    )
    expect(this.wrapper).toMatchSnapshot()   

    this.wrapper.setProps({disabled:true})
    expect(this.wrapper.find(".sk-tag-cloud").hasClass("is-disabled")).toBe(true)

    expect(this.wrapper.node.state.toggleItem).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-tag-cloud__item").at(2))
    expect(this.wrapper.node.state.toggleItem).toHaveBeenCalledWith("c")
  })

  it("should sort items", () => {
    let items = [
      { key: "d", doc_count: 15 },
      { key: "a", label: "a", doc_count: 10 },
      { key: "c", title: "C", doc_count: 12 },
      { key: "b", label: "B", doc_count: 11 },
    ]

    this.wrapper = mount(
      <MockList listComponent={TagCloud} items={items}/>
    )
    expect(this.wrapper).toMatchSnapshot()
  })

  it("mod + classname can be updated", () => {
    this.wrapper = mount(
      <MockList listComponent={TagCloud} mod="sk-other-class" className="my-custom-class"/>
    )

    expect(this.wrapper.find(".sk-other-class").hasClass("my-custom-class")).toBe(true)
  })

  it("show count", () => {
    this.wrapper = mount(
      <MockList listComponent={TagCloud} showCount={true}/>
    )

    expect(this.wrapper.find(".sk-tag-cloud__item").at(0).text())
      .toBe("A translated#10") // Count is appended in a span and styled with CSS
  })

})
