import * as React from "react";
import {mount} from "enzyme";

import { RangeHistogram } from './RangeHistogram'
import { MockRange } from './MockRange'


describe("RangeHistogram", () => {

  it("should render and behave correctly", () => {
    this.wrapper = mount(
      <MockRange rangeComponent={RangeHistogram}/>
    )
    expect(this.wrapper).toMatchSnapshot()
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
