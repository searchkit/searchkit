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
    this.urlBuilder = jasmine.createSpy("urlBuilder")
      .and.callFake((item)=> `http://localhost/?tag=${item.key}`)

    this.translate = (key)=> {
      return key + " translated"
    }
  })

  it("should render and behave correctly", ()=> {
    let props = {
      items:this.items, selectedItems: this.selectedItems,
      toggleItem: this.toggleItem, setItems: this.setItems, urlBuilder: this.urlBuilder,
      translate:this.translate
    }
    this.wrapper = mount(
      <TagCloud {...props}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-tag-cloud">
        <a href="http://localhost/?tag=a" className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: 10 }}>A translated</a>
        <a href="http://localhost/?tag=b" className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: 11 }}>B translated</a>
        <a href="http://localhost/?tag=c" className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: 12 }}>C translated</a>
        <a href="http://localhost/?tag=d" className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: 15 }}>d translated</a>
      </div>
    ))

    expect(this.urlBuilder.calls.count()).toBe(4)

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
      toggleItem: this.toggleItem, setItems: this.setItems, urlBuilder: this.urlBuilder,
      translate: this.translate,
    }
    this.wrapper = mount(
      <TagCloud {...props}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-tag-cloud">
        <a href="http://localhost/?tag=a" className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: 10 }}>a translated</a>
        <a href="http://localhost/?tag=b" className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: 11 }}>B translated</a>
        <a href="http://localhost/?tag=c" className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: 12 }}>C translated</a>
        <a href="http://localhost/?tag=d" className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: 15 }}>d translated</a>
        </div>
    ))
  })

  it("should work without urlBuilder", () => {
    let props = {
      items: this.items, selectedItems: this.selectedItems,
      toggleItem: this.toggleItem, setItems: this.setItems,
      translate: this.translate,
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
  })

  it("mod + classname can be updated", () => {
    let props = {
      items: this.items, selectedItems: this.selectedItems,
      toggleItem: this.toggleItem, setItems: this.setItems, urlBuilder: this.urlBuilder,
      translate: this.translate,
      mod: "sk-item-list-updated", className: "my-custom-class"
    }
    this.wrapper = mount(
      <TagCloud {...props}/>
    )

    expect(this.wrapper.find(".sk-item-list-updated").hasClass("my-custom-class")).toBe(true)
  })

})
