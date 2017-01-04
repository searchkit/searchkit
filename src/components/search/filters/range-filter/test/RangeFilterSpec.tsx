import * as React from "react";
import {mount} from "enzyme";
import {RangeFilter} from "../src/RangeFilter";
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
          rangeFormatter={(count)=> count + " score"}
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
      interval: undefined,
      loadHistogram:true,
      fieldOptions:{
        type:'embedded',
        field:'metascore'
      }
    })
  })

  it('renders correctly', () => {
    this.createWrapper(true)

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel filter--m">
        <div className="sk-panel__header">metascore</div>
        <div className="sk-panel__content">
          <div>
            <div className="sk-range-histogram">
              <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 60%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 100%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
              <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
            </div>
            <div className="sk-range-slider">
              <div className="rc-slider rc-slider-with-marks">
                <div className="rc-slider-rail"></div>
                <div className="rc-slider-track rc-slider-track-1" style={{visibility:" visible", " left":" 0%", " width":" 100%"}}></div>
                <div className="rc-slider-step"><span className="rc-slider-dot rc-slider-dot-active" style={{left:" 0%"}}></span><span className="rc-slider-dot rc-slider-dot-active" style={{left:" 100%"}}></span></div>
                <div className="rc-slider-handle rc-slider-handle-1 rc-slider-handle-lower" style={{left:" 0%"}}></div>
                <div className="rc-slider-handle rc-slider-handle-2 rc-slider-handle-upper" style={{left:" 100%"}}></div>
                <div className="rc-slider-mark"><span className="rc-slider-mark-text rc-slider-mark-text-active" style={{width:" 90%", " margin-left":" -45%", " left":" 0%"}}>0 score</span><span className="rc-slider-mark-text rc-slider-mark-text-active" style={{width:" 90%", " margin-left":" -45%", " left":" 100%"}}>100 score</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  })

  it("renders without histogram", () => {
    this.createWrapper(false)
    expect(this.wrapper.find(".sk-range-histogram").length).toBe(0)
    expect(this.wrapper.find(".sk-range-histogram__bar").length).toBe(0)
  })

  it("handle slider events correctly", ()=> {
    this.createWrapper(true)
    this.wrapper.node.sliderUpdate({min:30,max:70})
    expect(this.accessor.state.getValue()).toEqual({
      min:30, max:70
    })
    expect(this.searchkit.performSearch).not.toHaveBeenCalled()

    this.wrapper.node.sliderUpdateAndSearch({min:40,max:60})
    expect(this.accessor.state.getValue()).toEqual({
      min:40, max:60
    })
    expect(this.searchkit.performSearch).toHaveBeenCalled()

    // min/max should clear
    this.wrapper.node.sliderUpdateAndSearch({min:0,max:100})
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
    this.wrapper.node.sliderUpdate({min:30,max:70})
    expect(this.wrapper.find(".sk-range-histogram").html()).toEqual(jsxToHTML(
      <div className="sk-range-histogram">
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height:" 20%"}}></div>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height:" 60%"}}></div>
        <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
        <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
        <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
        <div className="sk-range-histogram__bar" style={{height:" 100%"}}></div>
        <div className="sk-range-histogram__bar" style={{height:" 20%"}}></div>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height:" 20%"}}></div>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height:" 20%"}}></div>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height:" 20%"}}></div>
      </div>
    ))
  })

});
