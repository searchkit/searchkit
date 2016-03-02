import * as React from "react";
import {mount} from "enzyme";
const bemBlock = require('bem-cn')
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
    this.toggleItem = jasmine.createSpy("toggleItem")

    this.props = {
      label:"Images", count:10,
      toggleItem:this.toggleItem,
      bemBlocks:this.bemBlocks, showCount:true
    }

  })

  it("ItemComponent render and behave correctly", ()=> {

    this.wrapper = mount(
      <ItemComponent {...this.props}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-item-option sk-item-container__item" data-qa="option">
        <div data-qa="label" className="sk-item-option__text">Images</div>
        <div data-qa="count" className="sk-item-option__count">10</div>
      </div>
    ))

    this.wrapper.setProps({showCount:false, showCheckbox:true})

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-item-option sk-item-container__item" data-qa="option">
        <input type="checkbox" data-qa="checkbox" readOnly className="sk-item-option__checkbox"/>
        <div data-qa="label" className="sk-item-option__text">Images</div>
      </div>
    ).replace(/checkbox"\/>/, `checkbox">`))

    this.wrapper.setProps({active:true})

    expect(this.wrapper.find(".sk-item-option").hasClass("is-active")).toBe(true)

    expect(this.toggleItem).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-item-option"))
    expect(this.toggleItem).toHaveBeenCalled()

  })


  it("test default props for subclassed components", ()=> {
    expect(CheckboxItemComponent.defaultProps.showCheckbox).toBe(true)
    expect(ItemComponent.defaultProps.showCheckbox).toBe(false)
  })


})
