import * as React from "react";
import {mount} from "enzyme";
import {NumericRefinementListFilter} from "../src/NumericRefinementListFilter";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../../__test__/TestHelpers"
import {SearchkitManager} from "../../../../../core";
const bem = require("bem-cn");
import * as sinon from "sinon";
const _ = require("lodash")

describe("NumericRefinementListFilter tests", () => {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.wrapper = mount(
      <NumericRefinementListFilter searchkit={this.searchkit} id="score" title="Score" field="score" options={[
        {title:"All"},
        {title:"up to 20", from:0, to:21},
        {title:"21 to 40", from:21, to:41}
      ]}/>
    )
    this.accessor = this.searchkit.accessors.accessors[0]
    this.setResults = ()=> {
      this.searchkit.setResults({
        aggregations:{
          score:{
            score:{
              buckets:[
                {key:"All", doc_count:30},
                {key:"up to 20", doc_count:10},
                {key:"21 to 40", doc_count:20}
              ]
            }
          }
        }
      })
    }
  })

  it("should set accessor options correctly", ()=> {
    expect(this.accessor.key).toBe("score")
    expect(this.accessor.options).toEqual({
      id:'score', field:"score", title:"Score", options:[
        {title:"All"},
        {title:"up to 20", from:0, to:21},
        {title:"21 to 40", from:21, to:41}
      ]
    })
  })

  it("should render correctly()", ()=> {
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-numeric-refinement-list filter--score">
        <div className="sk-numeric-refinement-list__header">Score</div>
        <div className="sk-numeric-refinement-list__options">
          <div className="sk-numeric-refinement-list-option sk-numeric-refinement-list__item">
            <div className="sk-numeric-refinement-list-option__text">All</div>
            <div className="sk-numeric-refinement-list-option__count">30</div>
          </div>
          <div className="sk-numeric-refinement-list-option sk-numeric-refinement-list__item">
            <div className="sk-numeric-refinement-list-option__text">up to 20</div>
            <div className="sk-numeric-refinement-list-option__count">10</div>
          </div>
          <div className="sk-numeric-refinement-list-option sk-numeric-refinement-list__item">
            <div className="sk-numeric-refinement-list-option__text">21 to 40</div>
            <div className="sk-numeric-refinement-list-option__count">20</div>
          </div>
        </div>
      </div>
    ))
  })

  it("should select correctly", ()=> {
    this.accessor.state = this.accessor.state.setValue("21 to 40")
    this.setResults()
    let lastOption = this.wrapper.find(".sk-numeric-refinement-list__options")
      .children().at(2)

    expect(hasClass(lastOption, "is-selected")).toBe(true)
  })

  it("should handle clicking an option", () => {
      this.setResults()
      let secondOption = this.wrapper.find(".sk-numeric-refinement-list__options")
          .children().at(1)
      fastClick(secondOption)
      expect(this.accessor.state.getValue()).toBe("up to 20")
      expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

  it("should be disabled for empty buckets", () => {
      expect(this.wrapper.find(".sk-numeric-refinement-list.is-disabled").length).toBe(1)
  })

})
