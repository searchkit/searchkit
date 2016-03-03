import * as React from "react";
import {mount} from "enzyme";
const bemBlock = require('bem-cn')

import { Select } from "./Select"

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("Select", ()=> {

  beforeEach(()=> {
    this.items = [
      {key:"a", label:"A", doc_count:10},
      {key:"b", label:"B", doc_count:11},
      {key:"c", title:"C", doc_count:12},
      {key:"c2", title: "C - invisible", doc_count: 12, hideInSelect: true},
      {key:"d", doc_count:15},
    ]

    this.selectedItems = ["a"]
    this.toggleItem = jasmine.createSpy("toggleItem")
    this.setItems = jasmine.createSpy("setItems")

    this.translate = (key)=> {
      return key + " translated"
    }

    let props = {
      items: this.items, selectedItems: this.selectedItems,
      toggleItem: this.toggleItem, setItems: this.setItems,
      translate: this.translate
    }
    this.wrapper = mount(
      <Select {...props}/>
    )
  })

  it("should render and behave correctly", ()=> {

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-select">
        <select defaultValue="a">
          <option value="a">A translated (10)</option>
          <option value="b">B translated (11)</option>
          <option value="c">C translated (12)</option>
          <option value="d">d translated (15)</option>
        </select>
      </div>
    ))

    this.wrapper.setProps({disabled:true})
    expect(this.wrapper.find(".sk-select").hasClass("is-disabled")).toBe(true)
  })

  it("mod + classname can be updated", () => {
    this.wrapper.setProps({
      mod: "sk-other-class", className: "my-custom-class"
    })

    expect(this.wrapper.find(".sk-other-class").hasClass("my-custom-class")).toBe(true)
  })

})
