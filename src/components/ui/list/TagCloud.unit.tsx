import * as React from "react";
import {mount} from "enzyme";
const bemBlock = require('bem-cn')

import { TagCloud } from "./TagCloud"

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("TagCloud", ()=> {

  beforeEach(()=> {
    this.items = [
      {key:"a", label:"A", doc_count:10},
      {key:"b", label:"B", doc_count:11},
      {key:"c", title:"C", doc_count:12},
      {key:"d", doc_count:15},
    ]

    this.selectedItems = ["a", "c"]
    this.toggleItem = jasmine.createSpy("toggleItem")
    this.setItems = jasmine.createSpy("setItems")

    this.translate = (key)=> {
      return key + " translated"
    }
  })

  it("should render and behave correctly", ()=> {
    let props = {
      items:this.items, selectedItems: this.selectedItems,
      toggleItem: this.toggleItem, setItems: this.setItems,
      translate:this.translate
    }
    this.wrapper = mount(
      <TagCloud {...props}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-tag-cloud">
        <span className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: 10 }}>A translated</span>
        <span className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: 11 }}>B translated</span>
        <span className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: 12 }}>C translated</span>
        <span className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: 15 }}>d translated</span>
      </div>
    ))

    this.wrapper.setProps({disabled:true})
    expect(this.wrapper.find(".sk-tag-cloud").hasClass("is-disabled")).toBe(true)

    expect(this.toggleItem).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-tag-cloud__item").at(2))
    expect(this.toggleItem).toHaveBeenCalledWith("c")
  })

  it("should sort items", () => {
    let props = {
      items: [
        { key: "d", doc_count: 15 },
        { key: "a", label: "a", doc_count: 10 },
        { key: "c", title: "C", doc_count: 12 },
        { key: "b", label: "B", doc_count: 11 },
      ], selectedItems: this.selectedItems,
      toggleItem: this.toggleItem, setItems: this.setItems,
      translate: this.translate,
    }
    this.wrapper = mount(
      <TagCloud {...props}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-tag-cloud">
        <span className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: 10 }}>a translated</span>
        <span className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: 11 }}>B translated</span>
        <span className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: 12 }}>C translated</span>
        <span className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: 15 }}>d translated</span>
      </div>
    ))
  })

  it("mod + classname can be updated", () => {
    let props = {
      items: this.items, selectedItems: this.selectedItems,
      toggleItem: this.toggleItem, setItems: this.setItems,
      translate: this.translate,
      mod: "sk-other-class", className: "my-custom-class"
    }
    this.wrapper = mount(
      <TagCloud {...props}/>
    )

    expect(this.wrapper.find(".sk-other-class").hasClass("my-custom-class")).toBe(true)
  })

})
