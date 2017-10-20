import * as React from "react";
import {mount} from "enzyme";

import { RangeSlider } from './RangeSlider'
import { MockRange } from './MockRange'


describe("RangeSlider", () => {

  it("should render and behave correctly", () => {
    this.wrapper = mount(
      <MockRange rangeComponent={RangeSlider}/>
    )
    expect(this.wrapper).toMatchSnapshot()

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
