import * as React from "react";
import {mount} from "enzyme";
import {
  ItemList,
  CheckboxItemList,
} from "./ItemListComponents"

import {
  ItemComponent,
  CheckboxItemComponent,
} from "./ItemComponents"

import {MockList} from "./MockList";

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("ItemList Components", ()=> {

  it("ItemList should render and behave correctly", ()=> {

    this.wrapper = mount(
      <MockList listComponent={ItemList}/>
    )
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div data-qa="options" className="sk-item-list">
        <div className="sk-item-list-option sk-item-list__item is-active" data-qa="option" data-key="a">
          <div data-qa="label" className="sk-item-list-option__text">A translated</div>
          <div data-qa="count" className="sk-item-list-option__count">#10</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item is-disabled" data-qa="option" data-key="b">
          <div data-qa="label" className="sk-item-list-option__text">B translated</div>
          <div data-qa="count" className="sk-item-list-option__count">#11</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item is-active" data-qa="option" data-key="c">
          <div data-qa="label" className="sk-item-list-option__text">C translated</div>
          <div data-qa="count" className="sk-item-list-option__count">#12</div>
        </div>
        <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="d">
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

    expect(this.wrapper.find("input[type='checkbox']").length).toBe(0)
    this.wrapper.setProps({itemComponent:CheckboxItemComponent})
    expect(this.wrapper.find("input[type='checkbox']").length).toBe(4)

    this.wrapper.setProps({mod:"my-item-list"})
    expect(this.wrapper.find(".my-item-list").length).toBe(1)

    expect(this.wrapper.node.state.toggleItem).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".my-item-list-option").at(2))
    expect(this.wrapper.node.state.toggleItem).toHaveBeenCalledWith("c")
  })

  it("check default props are set correctly", ()=> {
    expect(CheckboxItemList.defaultProps.itemComponent).toBe(CheckboxItemComponent)
    expect(ItemList.defaultProps.itemComponent).toBe(ItemComponent)
  })

  it("mod + classname can be updated", () => {
    let props = {
      items: this.items, selectedItems: this.selectedItems,
      toggleItem: this.toggleItem, setItems: this.setItems,
      translate: this.translate,
      mod: "sk-item-list-updated", className: "my-custom-class"
    }
    this.wrapper = mount(
      <MockList listComponent={ItemList} mod="sk-item-list-updated" className="my-custom-class"/>
    )

    expect(this.wrapper.find(".sk-item-list-updated").hasClass("my-custom-class")).toBe(true)
  })

})
