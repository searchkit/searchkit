import * as React from "react";
import {mount} from "enzyme";
import {MenuFilter} from "../src/MenuFilter.tsx";
import {SearchkitManager, Utils} from "../../../../../core";
const bem = require("bem-cn");
import * as sinon from "sinon";
const _ = require("lodash")
import {
  hasClass, jsxToHTML, printPrettyHtml, fastClick
} from "../../../../__test__/TestHelpers"


describe("MenuFilter tests", () => {

  beforeEach(()=> {
    Utils.guidCounter = 0
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.wrapper = mount(
      <MenuFilter
        searchkit={this.searchkit}
        translations={{"Red":"Red Translated"}}
        field="color" title="Color" orderKey="_term" orderDirection="asc"
        id="color" size={10}/>
    )
    this.getOptionAt = (at)=> {
      return this.wrapper.find(".sk-menu-list__options")
        .children().at(at)
    }
    this.accessor = this.searchkit.accessors.accessors[0]
    this.setResults = ()=> {
      this.searchkit.setResults({
        aggregations:{
          color1:{
            color:{
              buckets:[
                {key:"Red", doc_count:10},
                {key:"Blue", doc_count:11},
                {key:"Green", doc_count:12}
              ]
            }
          }
        }
      })
    }
  })

  it("expect accessor options to be correct", ()=> {
    expect(this.accessor.options).toEqual({
      id:"color", title:"Color", operator:"OR",
      size:10, facetsPerPage:50, orderKey:"_term", orderDirection:"asc"
    })
  })

  it("render correctly", ()=> {
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-menu-list filter--color">
        <div className="sk-menu-list__header">Color</div>
        <div className="sk-menu-list__options">
          <div className="sk-menu-list-option sk-menu-list__item is-selected" data-qa="option">
            <div data-qa="label" className="sk-menu-list-option__text">All</div>
            <div data-qa="count" className="sk-menu-list-option__count"></div>
          </div>
          <div className="sk-menu-list-option sk-menu-list__item" data-qa="option">
            <div data-qa="label" className="sk-menu-list-option__text">Red Translated</div>
            <div data-qa="count" className="sk-menu-list-option__count"></div>
          </div>
          <div className="sk-menu-list-option sk-menu-list__item" data-qa="option">
            <div data-qa="label" className="sk-menu-list-option__text">Blue</div>
            <div data-qa="count" className="sk-menu-list-option__count"></div>
          </div>
          <div className="sk-menu-list-option sk-menu-list__item" data-qa="option">
            <div data-qa="label" className="sk-menu-list-option__text">Green</div>
            <div data-qa="count" className="sk-menu-list-option__count"></div>
          </div>
        </div>
      </div>
    ))
  })

  it("render selected correctly", ()=> {
    this.accessor.state = this.accessor.state.setValue("Blue")
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-menu-list filter--color">
        <div className="sk-menu-list__header">Color</div>
        <div className="sk-menu-list__options">
          <div className="sk-menu-list-option sk-menu-list__item" data-qa="option">
            <div data-qa="label" className="sk-menu-list-option__text">All</div>
            <div data-qa="count" className="sk-menu-list-option__count"></div>
          </div>
          <div className="sk-menu-list-option sk-menu-list__item" data-qa="option">
            <div data-qa="label" className="sk-menu-list-option__text">Red Translated</div>
            <div data-qa="count" className="sk-menu-list-option__count"></div>
          </div>
          <div className="sk-menu-list-option sk-menu-list__item is-selected" data-qa="option">
            <div data-qa="label" className="sk-menu-list-option__text">Blue</div>
            <div data-qa="count" className="sk-menu-list-option__count"></div>
          </div>
          <div className="sk-menu-list-option sk-menu-list__item" data-qa="option">
            <div data-qa="label" className="sk-menu-list-option__text">Green</div>
            <div data-qa="count" className="sk-menu-list-option__count"></div>
          </div>
        </div>
      </div>
    ))
  })

  it("should handle selection correctly", ()=> {
    this.setResults()
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
  })


})
