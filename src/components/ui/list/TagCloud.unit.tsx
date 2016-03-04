import * as React from "react";
import {mount} from "enzyme";
const bemBlock = require('bem-cn')

import { TagCloud } from "./TagCloud"
import { MockList } from "./MockList"

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("TagCloud", ()=> {


  it("should render and behave correctly", ()=> {
    this.wrapper = mount(
      <MockList listComponent={TagCloud}/>
    )
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-tag-cloud">
        <span className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: '1em' }}><span>A translated</span></span>
        <span className="sk-tag-cloud__item is-disabled" data-qa="option" style={{ fontSize: '1.1em' }}><span>B translated</span></span>
        <span className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: '1.2em' }}><span>C translated</span></span>
        <span className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: '1.5em' }}><span>d translated</span></span>
      </div>
    ))

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

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-tag-cloud">
        <span className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: '1em' }}><span>a translated</span></span>
        <span className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: '1.1em' }}><span>B translated</span></span>
        <span className="sk-tag-cloud__item is-active" data-qa="option" style={{ fontSize: '1.2em' }}><span>C translated</span></span>
        <span className="sk-tag-cloud__item" data-qa="option" style={{ fontSize: '1.5em' }}><span>d translated</span></span>
      </div>
    ))
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
      .toBe("A translated10") // Count is appended in a span and styled with CSS
  })

})
