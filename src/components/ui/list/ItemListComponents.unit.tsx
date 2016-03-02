import * as React from "react";
import {mount} from "enzyme";
const bemBlock = require('bem-cn')
import {
  ItemList,
  CheckboxItemList,
} from "./ItemListComponents"

import {
  ItemComponent,
  CheckboxItemComponent,
} from "./ItemComponents"

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("ItemList Components", ()=> {

  beforeEach(()=> {
    this.items = [
      {key:"a", label:"A", doc_count:10},
      {key:"b", label:"B", doc_count:11},
      {key:"c", title:"C", doc_count:12},
      {key:"d", doc_count:13},
    ]

    this.selectedItems = ["a", "c"]
    this.toggleItem = jasmine.createSpy("toggleItem")
    this.urlBuilder = jasmine.createSpy("urlBuilder")
      .and.callFake((key)=> key)

    this.translate = (key)=> {
      return key + " translated"
    }

  })

  it("ItemList should render and behave correctly", ()=> {
    let props = {
      items:this.items, selectedItems: this.selectedItems,
      toggleItem:this.toggleItem, urlBuilder:this.urlBuilder,
      translate:this.translate
    }
    this.wrapper = mount(
      <ItemList {...props}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-item-list">
        <div className="sk-item-list-option sk-item-list__item is-active" data-qa="option">
          <div data-qa="label" className="sk-item-list-option__text">A translated</div>
          <div data-qa="count" className="sk-item-list-option__count">10</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item" data-qa="option">
          <div data-qa="label" className="sk-item-list-option__text">B translated</div>
          <div data-qa="count" className="sk-item-list-option__count">11</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item is-active" data-qa="option">
          <div data-qa="label" className="sk-item-list-option__text">C translated</div>
          <div data-qa="count" className="sk-item-list-option__count">12</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item" data-qa="option">
          <div data-qa="label" className="sk-item-list-option__text">d translated</div>
          <div data-qa="count" className="sk-item-list-option__count">13</div>
        </div>
      </div>
    ))

    expect(this.urlBuilder.calls.count()).toBe(4)

    this.wrapper.setProps({disabled:true})
    expect(this.wrapper.find(".sk-item-list").hasClass("is-disabled")).toBe(true)
    expect(this.wrapper.find(".sk-item-list-option__count").length).toBe(4)
    this.wrapper.setProps({showCount:false})
    expect(this.wrapper.find(".sk-item-list-option__count").length).toBe(0)

    expect(this.wrapper.find("input[type='checkbox']").length).toBe(0)
    this.wrapper.setProps({itemComponent:CheckboxItemComponent})
    expect(this.wrapper.find("input[type='checkbox']").length).toBe(4)

    this.wrapper.setProps({mod:"my-item-list"})
    expect(this.wrapper.find(".my-item-list").length).toBe(1)

    expect(this.toggleItem).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".my-item-list-option").at(2))
    expect(this.toggleItem).toHaveBeenCalledWith("c")
  })

  it("check default props are set correctly", ()=> {
    expect(CheckboxItemList.defaultProps.itemComponent).toBe(CheckboxItemComponent)
    expect(ItemList.defaultProps.itemComponent).toBe(ItemComponent)
  })

})
