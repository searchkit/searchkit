import * as React from "react";
import {mount} from "enzyme";

import { RangeInput } from './RangeInput'
import { MockRange } from './MockRange'

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("RangeInput", () => {

  it("should render and behave correctly", () => {
    this.wrapper = mount(
        <MockRange rangeComponent={RangeInput}/>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <form className="sk-range-input">
        <input type="number" className="sk-range-input__input" value="2" placeholder="min" onChange={() => {}}/>
        <div className="sk-range-input__to-label">-</div>
        <input type="number" className="sk-range-input__input" value="5" placeholder="max" onChange={() => {}}/>
        <button type="submit" className="sk-range-input__submit">Go</button>
      </form>
    ))
  })

  it("mod + classname can be updated", () => {
    this.wrapper = mount(
        <MockRange rangeComponent={RangeInput}
          mod="sk-range-slider-updated"
          className="my-custom-class" />
    )

    expect(this.wrapper.find(".sk-range-slider-updated").hasClass("my-custom-class")).toBe(true)
  })

})
