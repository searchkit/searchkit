import * as React from "react";
import {mount} from "enzyme";
import {RangeFilter} from "../src/RangeFilter.tsx";
import {SearchkitManager} from "../../../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../../__test__/TestHelpers"


import * as sinon from "sinon";

describe("Range Filter tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.createWrapper = (withHistogram, interval=undefined) => {
      this.wrapper = mount(
        <RangeFilter
          id="m"
          searchkit={this.searchkit}
          field="metascore"
          min={0}
          max={100}
          title="metascore"
          interval={interval}
          showHistogram={withHistogram}/>
      );

      this.searchkit.setResults({
        "aggregations": {
          "m": {
            "m": {
              "buckets": [
                {key:"10", doc_count:1},
                {key:"20", doc_count:3},
                {key:"30", doc_count:1},
                {key:"40", doc_count:1},
                {key:"50", doc_count:1},
                {key:"60", doc_count:5},
                {key:"70", doc_count:1},
                {key:"80", doc_count:1},
                {key:"90", doc_count:1},
                {key:"100", doc_count:1}

              ]
            }
          }
        }
      })

      this.wrapper.update()
      this.accessor = this.searchkit.accessors.getAccessors()[0]
    }


  });


  it("accessor has correct config", () => {
    this.createWrapper(true)
    expect(this.accessor.options).toEqual({
      id:"m",
      min:0,
      max:100,
      field:"metascore",
      title:"metascore",
      interval: undefined
    })
  })

  it('renders correctly', () => {
    this.createWrapper(true)
    expect(this.wrapper.html()).toEqual(jsxToHTML(
    <div className="sk-range-filter">
      <div className="sk-range-filter__header">metascore</div>
      <div className="bar-chart">
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"60%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"100%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
      </div>
      <div className="rc-slider">
        <div className="rc-slider-handle" style={{left:"100%"}}></div>
        <div className="rc-slider-handle" style={{left:"0%"}}></div>
        <div className="rc-slider-track" style={{left:"0%", width:"100%", visibility:"visible"}}></div>
        <div className="rc-slider-step"></div>
        <div className="rc-slider-mark"></div>
      </div>
      <div className="sk-range-filter__x-label sk-range-filter-value-labels">
        <div className="sk-range-filter-value-labels__min">0</div>
        <div className="sk-range-filter-value-labels__max">100</div>
      </div>
    </div>
    ))
  })

  it("renders without histogram", () => {
    this.createWrapper(false)
    expect(this.wrapper.find(".bar-chart").length).toBe(0)
    expect(this.wrapper.find(".bar-chart__bar").length).toBe(0)
  })

  it("handle slider events correctly", ()=> {
    this.createWrapper(true)
    this.wrapper.node.sliderUpdate([30,70])
    expect(this.accessor.state.getValue()).toEqual({
      min:30, max:70
    })
    expect(this.searchkit.performSearch).not.toHaveBeenCalled()

    this.wrapper.node.sliderUpdateAndSearch([40,60])
    expect(this.accessor.state.getValue()).toEqual({
      min:40, max:60
    })
    expect(this.searchkit.performSearch).toHaveBeenCalled()

    // min/max should clear
    this.wrapper.node.sliderUpdateAndSearch([0,100])
    expect(this.accessor.state.getValue()).toEqual({})
  })

  it("has default interval", ()=> {
    this.createWrapper(true)
    expect(this.accessor.getInterval()).toEqual(5)
  })

  it("handles interval correctly", ()=> {
    this.createWrapper(true, 2)
    expect(this.accessor.getInterval()).toEqual(2)
  })

  it("renders limited range correctly", ()=> {
    this.createWrapper(true)
    this.wrapper.node.sliderUpdate([30,70])
    expect(this.wrapper.find(".bar-chart").html()).toEqual(jsxToHTML(
      <div className="bar-chart">
        <div className="bar-chart__bar is-out-of-bounds" style={{height:"20%"}}></div>
        <div className="bar-chart__bar is-out-of-bounds" style={{height:"60%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar" style={{height:"100%"}}></div>
        <div className="bar-chart__bar" style={{height:"20%"}}></div>
        <div className="bar-chart__bar is-out-of-bounds" style={{height:"20%"}}></div>
        <div className="bar-chart__bar is-out-of-bounds" style={{height:"20%"}}></div>
        <div className="bar-chart__bar is-out-of-bounds" style={{height:"20%"}}></div>
      </div>
    ))
  })

});
