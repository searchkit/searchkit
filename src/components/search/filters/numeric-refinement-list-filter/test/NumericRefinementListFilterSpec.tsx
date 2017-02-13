import * as React from "react";
import {mount} from "enzyme";
import {NumericRefinementListFilter} from "../src/NumericRefinementListFilter";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../../__test__/TestHelpers"
import {SearchkitManager, Utils} from "../../../../../core";
import {Select} from "../../../../ui";
const bem = require("bem-cn");
import * as sinon from "sinon";
import * as _ from "lodash"

describe("NumericRefinementListFilter tests", () => {

  beforeEach(()=> {
    Utils.guidCounter = 0
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.setWrapper = (props={})=>{
      this.wrapper = mount(
        <NumericRefinementListFilter {...props} searchkit={this.searchkit} id="score" title="Score" field="score" options={[
          {title:"All", key:"everything"},
          {title:"up to 20", from:0, to:21},
          {title:"21 to 40", from:21, to:41}
        ]}/>
      )
      this.accessor = this.searchkit.accessors.accessors[0]
    }
    this.setResults = ()=> {
      this.searchkit.setResults({
        aggregations:{
          score1:{
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

    this.getOptionAt = (index)=> {
      return this.wrapper.find(".sk-item-list-option").at(index)
    }
  })

  it("should set accessor options correctly", ()=> {
    this.setWrapper()
    expect(this.accessor.key).toBe("score")
    expect(this.accessor.options).toEqual({
      id:'score', field:"score", title:"Score", options:[
        {title:"All", key:"everything"},
        {title:"up to 20", from:0, to:21, key:"0_21"},
        {title:"21 to 40", from:21, to:41, key:"21_41"}
      ],
      multiselect:false,
      fieldOptions:{
        type:'embedded', field:'score'
      }
    })
  })

  it("should render correctly()", ()=> {
    this.setWrapper()
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel filter--score">
        <div className="sk-panel__header">Score</div>
        <div className="sk-panel__content">
          <div data-qa="options" className="sk-item-list">
            <div className="sk-item-list-option sk-item-list__item is-active" data-qa="option" data-key="All">
              <div data-qa="label" className="sk-item-list-option__text">All</div>
              <div data-qa="count" className="sk-item-list-option__count">30</div>
            </div>
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="up to 20">
              <div data-qa="label" className="sk-item-list-option__text">up to 20</div>
              <div data-qa="count" className="sk-item-list-option__count">10</div>
            </div>
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="21 to 40">
              <div data-qa="label" className="sk-item-list-option__text">21 to 40</div>
              <div data-qa="count" className="sk-item-list-option__count">20</div>
            </div>
          </div>
        </div>
      </div>
    ))

  })

  it("should select correctly", ()=> {
    this.setWrapper()
    this.accessor.state = this.accessor.state.setValue(["21_41"])
    this.setResults()
    let lastOption = this.getOptionAt(2)
    expect(hasClass(lastOption, "is-active")).toBe(true)
  })

  it("should handle clicking an option", () => {
    this.setWrapper()
    this.setResults()
    let secondOption = this.getOptionAt(1)
    let thirdOption = this.getOptionAt(2)
    fastClick(secondOption)
    expect(this.accessor.state.getValue()).toEqual(["0_21"])
    expect(this.searchkit.performSearch).toHaveBeenCalled()
    this.accessor.options.multiselect = true
    fastClick(thirdOption)
    this.accessor.options.multiselect = false
    fastClick(thirdOption)
    expect(this.accessor.state.getValue()).toEqual(['21_41'])
  })

  it("should be disabled for empty buckets", () => {
    this.setWrapper()
    expect(this.wrapper.find(".sk-panel.is-disabled").length).toBe(1)
  })

  it("should allow custom mod, className, listComponent, translations", ()=> {
    this.setWrapper({
      mod:"my-numeric", className:"my-class",
      listComponent:Select, translations:{"All":"Everything"},
      countFormatter:(count)=>"#"+count

    })
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel filter--score">
        <div className="sk-panel__header">Score</div>
        <div className="sk-panel__content">
          <div className="my-numeric my-class">
            <select>
              <option value="All">Everything (#30)</option>
              <option value="up to 20">up to 20 (#10)</option>
              <option value="21 to 40">21 to 40 (#20)</option>
            </select>
          </div>
        </div>
      </div>
    ))
  })

})
