import * as React from "react";
import * as ReactDOM from "react-dom";
import {mount, render} from "enzyme";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../__test__/TestHelpers"
import {MenuFilter} from "./MenuFilter";
import {SearchkitManager, Utils, ArrayState} from "../../../../core";
import {Toggle, ItemComponent, ItemList} from "../../../ui";
const bem = require("bem-cn");
import * as _ from "lodash"
import * as sinon from "sinon";

describe("MenuFilter", ()=> {

  beforeEach(()=> {
    Utils.guidCounter = 0
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.wrapper = mount(
      <MenuFilter
        searchkit={this.searchkit}
        translations={{"Red":"Red Translated"}}
        field="color" title="Color" orderKey="_term" orderDirection="asc"
        include="title" exclude={["n/a"]}
        id="color" size={10}/>
    )
    this.getOptionAt = (at)=> {
      return this.wrapper.find(".sk-item-list")
        .children().at(at)
    }
    this.accessor = this.searchkit.accessors.accessors[0]
    this.searchkit.setResults({
      aggregations:{
        color1:{
          color:{
            buckets:[
              {key:"Red", doc_count:10},
              {key:"Blue", doc_count:11},
              {key:"Green", doc_count:12}
            ]
          },
          doc_count:33
        }
      }
    })
  })

  it("expect accessor options to be correct", ()=> {
    expect(this.wrapper.node.props.listComponent).toBe(ItemList)
    expect(this.accessor.options).toEqual(jasmine.objectContaining({
      id:"color", field:"color", title:"Color", operator:"OR",
      translations:{"Red":"Red Translated"},
      size:10, facetsPerPage:50, orderKey:"_term",
      orderDirection:"asc", include:"title", exclude:["n/a"],
      "fieldOptions":{
        type:"embedded",
        field:"color"
      }
    }))
  })

  it("getSelectedItems", ()=> {
    this.accessor.state = new ArrayState([])
    expect(this.wrapper.node.getSelectedItems())
      .toEqual(['$all'])
    this.accessor.state = new ArrayState([false])
    expect(this.wrapper.node.getSelectedItems())
      .toEqual([false])
    this.accessor.state = new ArrayState(["foo", "bar"])
    expect(this.wrapper.node.getSelectedItems())
      .toEqual(["foo"])
  })

  it("should render correctly", ()=> {
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel filter--color">
        <div className="sk-panel__header">Color</div>
        <div className="sk-panel__content">
          <div data-qa="options" className="sk-item-list">
            <div className="sk-item-list-option sk-item-list__item is-active" data-qa="option" data-key="$all">
              <div data-qa="label" className="sk-item-list-option__text">All</div>
              <div data-qa="count" className="sk-item-list-option__count">33</div>
            </div>
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="Red">
              <div data-qa="label" className="sk-item-list-option__text">Red Translated</div>
              <div data-qa="count" className="sk-item-list-option__count">10</div>
            </div>
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="Blue">
              <div data-qa="label" className="sk-item-list-option__text">Blue</div>
              <div data-qa="count" className="sk-item-list-option__count">11</div>
            </div>
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="Green">
              <div data-qa="label" className="sk-item-list-option__text">Green</div>
              <div data-qa="count" className="sk-item-list-option__count">12</div>
            </div>
          </div>
        </div>
      </div>
    ))
  })

  it("should handle selection correctly", ()=> {
    let all = this.getOptionAt(0)
    let blue = this.getOptionAt(2)
    let green = this.getOptionAt(3)
    fastClick(blue)
    expect(this.accessor.state.getValue()).toEqual(["Blue"])
    fastClick(green)
    expect(this.accessor.state.getValue()).toEqual(["Green"])
    expect(this.searchkit.performSearch).toHaveBeenCalled()

    //should clear if button clicked
    fastClick(green)
    expect(this.accessor.state.getValue()).toEqual([])
    fastClick(blue)
    expect(this.accessor.state.getValue()).toEqual(["Blue"])
    fastClick(all)
    expect(this.accessor.state.getValue()).toEqual([])
    fastClick(all)
    expect(this.accessor.state.getValue()).toEqual([])

  })
})
