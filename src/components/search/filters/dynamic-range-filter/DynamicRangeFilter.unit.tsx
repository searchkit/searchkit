import * as React from "react";
import {mount} from "enzyme";
import {DynamicRangeFilter} from "./DynamicRangeFilter";
import {SearchkitManager} from "../../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../__test__/TestHelpers"

describe("Dynamic Range Filter tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.createWrapper = () => {
      this.wrapper = mount(
        <DynamicRangeFilter
          id="m"
          searchkit={this.searchkit}
          field="metascore"
          title="metascore"
          rangeFormatter={(count)=> count + " score"}
        />
      );

      this.searchkit.setResults({
        "aggregations": {
          "m": {
            "m": {
              avg: 20,
              count:1,
              max:120,
              min:1,
              sum:100000
            }
          }
        }
      })

      this.wrapper.update()
      this.accessor = this.searchkit.accessors.getAccessors()[0]
    }

  });

  it("renders correctly", () => {
    this.createWrapper()
    expect(this.wrapper.html()).toBe(jsxToHTML(
      <div className="sk-panel filter--m">
        <div className="sk-panel__header">metascore</div>
        <div className="sk-panel__content">
          <div className="sk-range-slider">
            <div className="rc-slider rc-slider-with-marks">
              <div className="rc-slider-rail"></div>
              <div className="rc-slider-track rc-slider-track-1" style={{visibility:" visible", " left":" 0%", " width":" 100%"}}></div>
              <div className="rc-slider-step"><span className="rc-slider-dot rc-slider-dot-active" style={{left:" 0%"}}></span><span className="rc-slider-dot rc-slider-dot-active" style={{left:" 100%"}}></span></div>
              <div className="rc-slider-handle rc-slider-handle-1 rc-slider-handle-lower" style={{left:" 0%"}}></div>
              <div className="rc-slider-handle rc-slider-handle-2 rc-slider-handle-upper" style={{left:" 100%"}}></div>
              <div className="rc-slider-mark"><span className="rc-slider-mark-text rc-slider-mark-text-active" style={{width:" 90%", " margin-left":" -45%", " left":" 0%"}}>1 score</span><span className="rc-slider-mark-text rc-slider-mark-text-active" style={{width:" 90%", " margin-left":" -45%", " left":" 100%"}}>120 score</span></div>
            </div>
          </div>
        </div>
      </div>
    ))
  })

  it("accessor has correct config", () => {
    this.createWrapper()
    expect(this.accessor.options).toEqual({
      id:"m",
      field:"metascore",
      title:"metascore",
      fieldOptions:{
        type:"embedded",
        field:"metascore"
      }
    })
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
    this.wrapper.node.sliderUpdateAndSearch({min:1,max:120})
    expect(this.accessor.state.getValue()).toEqual({})
  })


});
