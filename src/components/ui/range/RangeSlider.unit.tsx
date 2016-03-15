import * as React from "react";
import {mount} from "enzyme";

import { RangeSlider } from './RangeSlider'
import { MockRange } from './MockRange'

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("RangeSlider", () => {

  it("should render and behave correctly", () => {
    this.wrapper = mount(
      <MockRange rangeComponent={RangeSlider}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-range-slider">
        <div className="rc-slider">
          <div className="rc-slider-handle" style={{ left: "50%" }}></div>
          <div className="rc-slider-handle" style={{ left: "20%" }}></div>
          <div className="rc-slider-track" style={{ left: "20%", width: "30%", visibility: "visible" }}></div>
          <div className="rc-slider-step">
            <span className="rc-slider-dot" style={{ left: "0%" }}></span>
            <span className="rc-slider-dot" style={{ left: "100%" }}></span>
          </div>
          <div className="rc-slider-mark">
            <span className="rc-slider-mark-text" style={{ width: "90%", left: "-45%" }}>0</span>
            <span className="rc-slider-mark-text" style={{ width: "90%", left: "55%" }}>10</span>
          </div>
        </div>
      </div>
    ))
  })

  it("mod + classname can be updated", () => {
    this.wrapper = mount(
      <MockRange rangeComponent={RangeSlider}
        mod="sk-range-slider-updated"
        className="my-custom-class" />
    )

    expect(this.wrapper.find(".sk-range-slider-updated").hasClass("my-custom-class")).toBe(true)
  })

})
