import * as React from "react";
import {mount} from "enzyme";
const bemBlock = require('bem-cn')

import { Toggle } from "./Toggle"
import { MockList } from "./MockList"

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("Toggle", ()=> {

  it("should render and behave correctly", ()=> {
    this.wrapper = mount(
      <MockList listComponent={Toggle} showCount={true}/>
    )
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-toggle">
        <div className="sk-toggle__action is-active">A translated (10)</div>
        <div className="sk-toggle__action is-disabled">B translated (11)</div>
        <div className="sk-toggle__action is-active">C translated (12)</div>
        <div className="sk-toggle__action">d translated (15)</div>
      </div>
    ))

    expect(this.wrapper.node.state.toggleItem).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-toggle__action").at(2))
    expect(this.wrapper.node.state.toggleItem).toHaveBeenCalledWith("c")
  })


  it("mod can be updated", () => {
    this.wrapper = mount(
      <MockList listComponent={Toggle} mod="sk-toggle-updated" className="my-custom-class"/>
    )
    expect(this.wrapper.find(".sk-toggle-updated").length).toBe(1)
  })

  it("can be disabled", ()=> {
    this.wrapper = mount(
      <MockList listComponent={Toggle} disabled={true}/>
    )
    expect(this.wrapper.find(".sk-toggle").hasClass("is-disabled")).toBe(true)
  })

  it("without numbers", ()=> {
    this.wrapper = mount(
      <MockList listComponent={Toggle} showCount={false}/>
    )
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-toggle">
        <div className="sk-toggle__action is-active">A translated</div>
        <div className="sk-toggle__action is-disabled">B translated</div>
        <div className="sk-toggle__action is-active">C translated</div>
        <div className="sk-toggle__action">d translated</div>
      </div>
    ))
  })

})
