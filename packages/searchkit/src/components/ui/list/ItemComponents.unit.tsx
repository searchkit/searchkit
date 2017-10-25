import * as React from "react"
import {mount} from "enzyme"

import {
  ItemComponent,
  CheckboxItemComponent,
} from "./ItemComponents"

import {
  block
} from "../../../"

import { fastClick} from "../../__test__/TestHelpers"

describe("ItemComponents", ()=> {

  beforeEach(()=> {
    this.bemBlocks = {
      container:block("sk-item-container").el,
      option:block("sk-item-option").el
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
        
    expect(this.wrapper).toMatchSnapshot()
    this.wrapper.setProps({showCount:false, showCheckbox:true})

    expect(this.wrapper).toMatchSnapshot()
    
    this.wrapper.setProps({showCount:true, showCheckbox:false, count: undefined})

    expect(this.wrapper).toMatchSnapshot()


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
