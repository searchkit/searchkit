import * as React from "react";
import {mount} from "enzyme";

import { ItemHistogramList } from "./ItemHistogramList"

import {MockList} from "./MockList";

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("ItemHistogramList Components", ()=> {

  it("should render and behave correctly", ()=> {
    this.wrapper = mount(
      <MockList listComponent={ItemHistogramList}/>
    )

    const total = 10+11+12+15
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div data-qa="options" className="sk-item-list">
        <div className="sk-item-list-option sk-item-list__item is-active is-histogram" data-qa="option" data-key="a">
          <div className="sk-item-list-option__bar-container">
            <div className="sk-item-list-option__bar" style={{width:" 20.833333333333336%"}}></div>
          </div>
          <div data-qa="label" className="sk-item-list-option__text">A translated</div>
          <div data-qa="count" className="sk-item-list-option__count">#10</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item is-disabled is-histogram" data-qa="option" data-key="b">
          <div className="sk-item-list-option__bar-container">
            <div className="sk-item-list-option__bar" style={{width:" 22.916666666666664%"}}></div>
          </div>
          <div data-qa="label" className="sk-item-list-option__text">B translated</div>
          <div data-qa="count" className="sk-item-list-option__count">#11</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item is-active is-histogram" data-qa="option" data-key="c">
          <div className="sk-item-list-option__bar-container">
            <div className="sk-item-list-option__bar" style={{width:" 25%"}}></div>
          </div>
          <div data-qa="label" className="sk-item-list-option__text">C translated</div>
          <div data-qa="count" className="sk-item-list-option__count">#12</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item is-histogram" data-qa="option" data-key="d">
          <div className="sk-item-list-option__bar-container">
            <div className="sk-item-list-option__bar" style={{width:" 31.25%"}}></div>
          </div>
          <div data-qa="label" className="sk-item-list-option__text">d translated</div>
          <div data-qa="count" className="sk-item-list-option__count">#15</div>
        </div>
      </div>
    ))

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
