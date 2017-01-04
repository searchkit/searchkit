import * as React from "react";;
import {mount, render} from "enzyme";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

import {
  SearchkitComponent, ISizeOption,PageSizeAccessor,
  FastClick, renderComponent, SearchkitManager
} from "../../../core"

import {
   Toggle, PageSizeSelector, Hits
} from "../../"

describe("PageSizeSelector", ()=> {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()

    this.setWrapper = (props={})=>{
      this.wrapper = mount(
        <div>
          <PageSizeSelector options={[4,12,24]} searchkit={this.searchkit} {...props}/>
          <Hits hitsPerPage={12} searchkit={this.searchkit}/>
        </div>
      )

      this.searchkit.setResults({
        hits:{
          hits:[{_id:1, title:1},{_id:2,title:2}],
          total:2
        }
      })
      this.accessor = this.searchkit.getAccessorByType(PageSizeAccessor)
    }
  })

  it("getSize()", ()=> {
    this.setWrapper()
    expect(this.accessor.getSize()).toBe(12)
    this.accessor.state = this.accessor.state.setValue("24")
    expect(this.accessor.getSize()).toBe(24)
  })

  it("should render and behave correctly", ()=> {
    this.setWrapper()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div>
        <div className="sk-select">
          <select>
            <option value="4">4</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </select>
        </div>
        <div data-qa="hits" className="sk-hits">
          <div data-qa="hit" className="sk-hits-hit sk-hits__item">1</div>
          <div data-qa="hit" className="sk-hits-hit sk-hits__item">2</div>
        </div>
      </div>
    ))

    const option24 = this.wrapper.find("select").children().at(2)
    option24.simulate("change")
    expect(this.accessor.getSize()).toBe(24)
  })

  it("should set mod, className, custom listComponent", ()=> {
    this.setWrapper({
      mod:"my-page-selector", className:"my-class",
      listComponent:Toggle
    })
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div>
        <div data-qa="options" className="my-page-selector my-class">
          <div className="my-page-selector-option my-page-selector__item" data-qa="option" data-key="4">
            <div data-qa="label" className="my-page-selector-option__text">4</div>
          </div>
          <div className="my-page-selector-option my-page-selector__item is-active" data-qa="option" data-key="12">
            <div data-qa="label" className="my-page-selector-option__text">12</div>
          </div>
          <div className="my-page-selector-option my-page-selector__item" data-qa="option" data-key="24">
            <div data-qa="label" className="my-page-selector-option__text">24</div>
          </div>
        </div>
        <div data-qa="hits" className="sk-hits">
          <div data-qa="hit" className="sk-hits-hit sk-hits__item">1</div>
          <div data-qa="hit" className="sk-hits-hit sk-hits__item">2</div>
        </div>
      </div>
    ))
  })

})
