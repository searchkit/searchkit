import * as React from "react";
import {mount} from "enzyme";
import {SortingSelector} from "../src/SortingSelector.tsx";
import {SearchkitManager } from "../../../../core";
const bem = require("bem-cn");
import * as sinon from "sinon";
const _ = require("lodash")
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../__test__/TestHelpers"

describe("SortingSelector tests", () => {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.setWrapper = () => {
      this.wrapper = mount(
        <SortingSelector searchkit={this.searchkit} options={[
          {label:"Relevance"},
          {label:"Latest Releases", field:"released", order:"desc"},
          {label:"Earliest Releases", field:"released", order:"asc"}
        ]}/>
      )
    }
    this.setWrapper()
    this.accessor = this.searchkit.accessors.accessors[0]
    this.setResults = ()=> {
      this.searchkit.setResults({
        hits:{
          hits:[1,2],
          total:2
        }
      })
    }
  })

  it("is disabled when no results", ()=> {
    expect(this.wrapper.children().length).toBe(1)
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-sorting-selector is-disabled">
        <select defaultValue="Relevance">
          <option value="Relevance">Relevance</option>
          <option value="Latest Releases">Latest Releases</option>
          <option value="Earliest Releases">Earliest Releases</option>
        </select>
      </div>
    ))
  })

  it("renders with results", ()=> {
    this.setResults()
    expect(this.wrapper.children().length).toBe(1)
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-sorting-selector">
        <select defaultValue="Relevance">
          <option value="Relevance">Relevance</option>
          <option value="Latest Releases">Latest Releases</option>
          <option value="Earliest Releases">Earliest Releases</option>
        </select>
      </div>
    ))
  })

  it("renders with selected value", ()=> {
    this.accessor.state = this.accessor.state.setValue("Latest Releases")
    this.setResults()
    this.setWrapper()

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-sorting-selector">
        <select defaultValue="Latest Releases" onChange={_.identity}>
          <option value="Relevance">Relevance</option>
          <option value="Latest Releases">Latest Releases</option>
          <option value="Earliest Releases">Earliest Releases</option>
        </select>
      </div>
    ))
  })

  it("renders with defaultOption", ()=> {
    this.accessor.options.options[2].defaultOption = true
    this.setResults()
    this.setWrapper()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-sorting-selector">
        <select defaultValue="Earliest Releases" onChange={_.identity}>
          <option value="Relevance">Relevance</option>
          <option value="Latest Releases">Latest Releases</option>
          <option value="Earliest Releases">Earliest Releases</option>
        </select>
      </div>
    ))
  })

  it("select new sort option", ()=> {
    this.accessor.state = this.accessor.state.setValue("Latest Releases")
    this.setResults()
    let earlyOption = this.wrapper.find("select").children().at(2)
    earlyOption.simulate("change")
    expect(this.accessor.state.getValue()).toBe("Earliest Releases")
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

})
