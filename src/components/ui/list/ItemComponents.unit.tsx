import * as React from "react"
import {mount} from "enzyme"
let bemBlock = require("bem-cn")

import {
  ItemComponent,
  CheckboxItemComponent
} from "./ItemComponents"
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("ItemComponents", ()=> {

  beforeEach(()=> {
    this.bemBlocks = {
      container:bemBlock("sk-item-container"),
      option:bemBlock("sk-item-option")
    }
    this.onClick = jasmine.createSpy("toggleItem")


    this.props = {
      label:"Images", count:10, itemKey:"images",
      onClick: this.onClick,
      bemBlocks:this.bemBlocks, showCount:true
    }

  })

  it("should render and behave correctly", ()=> {

    this.wrapper = mount(
      <ItemComponent {...this.props}/>
    )
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-item-option sk-item-container__item" data-qa="option" data-key="images">
        <div data-qa="label" className="sk-item-option__text">Images</div>
        <div data-qa="count" className="sk-item-option__count">10</div>
      </div>
    ))

    this.wrapper.setProps({showCount:false, showCheckbox:true})

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-item-option sk-item-container__item" data-qa="option" data-key="images">
        <input type="checkbox" data-qa="checkbox" readOnly className="sk-item-option__checkbox" value="on"/>
        <div data-qa="label" className="sk-item-option__text">Images</div>
      </div>
    ).replace(/checkbox"\/>/, `checkbox">`))

    this.wrapper.setProps({showCount:true, showCheckbox:false, count: undefined})

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-item-option sk-item-container__item" data-qa="option" data-key="images">
        <div data-qa="label" className="sk-item-option__text">Images</div>
      </div>
    ))

    this.wrapper.setProps({active:true})

    expect(this.wrapper.find(".sk-item-option").hasClass("is-active")).toBe(true)

    expect(this.onClick).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-item-option"))
    expect(this.onClick).toHaveBeenCalled()

  })


  it("test default props for subclassed components", ()=> {
    expect(CheckboxItemComponent.defaultProps.showCheckbox).toBe(true)
    expect(ItemComponent.defaultProps.showCheckbox).toBe(false)
  })


})
