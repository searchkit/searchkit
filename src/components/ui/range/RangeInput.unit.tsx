import * as React from "react";
import {mount} from "enzyme";

import { RangeInput } from './RangeInput'
import { MockRange } from './MockRange'


describe("RangeInput", () => {

  it("should render and behave correctly", () => {
    this.wrapper = mount(
        <MockRange rangeComponent={RangeInput}/>
    )
    expect(this.wrapper).toMatchSnapshot()
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
