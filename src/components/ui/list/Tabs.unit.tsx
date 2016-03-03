import * as React from "react";
import {mount} from "enzyme";

import { Tabs } from "./Tabs"
import { MockList } from "./MockList"

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("Tabs", ()=> {

  it("should render and behave correctly", ()=> {
    this.wrapper = mount(
      <MockList listComponent={Tabs} showCount={true}/>
    )
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <ul className="sk-tabs">
        <li className="sk-tabs__tab is-active">A translated (10)</li>
        <li className="sk-tabs__tab is-disabled">B translated (11)</li>
        <li className="sk-tabs__tab">C translated (12)</li>
        <li className="sk-tabs__tab">d translated (15)</li>
      </ul>
    ))

    expect(this.wrapper.node.state.setItems).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-tabs__tab").at(2))
    expect(this.wrapper.node.state.setItems).toHaveBeenCalledWith(["c"])
  })

  it("mod can be updated", () => {
    this.wrapper = mount(
      <MockList listComponent={Tabs} mod="sk-tabs-updated" className="my-custom-class"/>
    )
    expect(this.wrapper.find(".sk-tabs-updated").length).toBe(1)
    expect(this.wrapper.find(".sk-tabs-updated").hasClass("my-custom-class")).toBe(true)
  })

  it("can be disabled", ()=> {
    this.wrapper = mount(
      <MockList listComponent={Tabs} disabled={true}/>
    )
    expect(this.wrapper.find(".sk-tabs").hasClass("is-disabled")).toBe(true)
  })

  it("without numbers", ()=> {
    this.wrapper = mount(
      <MockList listComponent={Tabs} showCount={false}/>
    )
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <ul className="sk-tabs">
        <li className="sk-tabs__tab is-active">A translated</li>
        <li className="sk-tabs__tab is-disabled">B translated</li>
        <li className="sk-tabs__tab">C translated</li>
        <li className="sk-tabs__tab">d translated</li>
      </ul>
    ))
  })

})
