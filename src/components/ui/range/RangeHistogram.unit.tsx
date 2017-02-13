import * as React from "react";
import {mount} from "enzyme";

import { RangeHistogram } from './RangeHistogram'
import { MockRange } from './MockRange'

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("RangeHistogram", () => {

  it("should render and behave correctly", () => {
    this.wrapper = mount(
      <MockRange rangeComponent={RangeHistogram}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-range-histogram">
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height: ' 0%'}}/>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height: ' 0%'}}/>
        <div className="sk-range-histogram__bar" style={{height: ' 0%'}}/>
        <div className="sk-range-histogram__bar" style={{height: ' 60%'}}/>
        <div className="sk-range-histogram__bar" style={{height: ' 70%'}}/>
        <div className="sk-range-histogram__bar" style={{height: ' 80%'}}/>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height: ' 0%'}}/>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height: ' 100%'}}/>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height: ' 0%'}}/>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height: ' 0%'}}/>
        <div className="sk-range-histogram__bar is-out-of-bounds" style={{height: ' 0%'}}/>
      </div>
    ))
  })

  it("mod + classname can be updated", () => {
    this.wrapper = mount(
      <MockRange rangeComponent={RangeHistogram}
        mod="sk-range-histogram-updated"
        className="my-custom-class" />
    )

    expect(this.wrapper.find(".sk-range-histogram-updated").hasClass("my-custom-class")).toBe(true)
  })

})
