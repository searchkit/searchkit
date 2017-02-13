import * as React from "react";
import {mount} from "enzyme";

import { Select } from "./Select"
import { MockList} from "./MockList"

import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("Select", ()=> {

  beforeEach(()=> {
    this.wrapper = mount(
      <MockList listComponent={Select}/>
    )
  })

  it("should render and behave correctly", ()=> {
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-select">
        <select>
          <option value="a">A translated (#10)</option>
          <option value="b" disabled={true}>B translated (#11)</option>
          <option value="c">C translated (#12)</option>
          <option value="d">d translated (#15)</option>
        </select>
      </div>
    ))

    const optionC = this.wrapper.find("select").children().at(2)
    optionC.simulate("change")
    expect(this.wrapper.node.state.setItems).toHaveBeenCalledWith(["c"])
    this.wrapper.setProps({disabled:true})
    expect(this.wrapper.find(".sk-select").hasClass("is-disabled")).toBe(true)
  })

  it("mod + classname can be updated", () => {
    this.wrapper.setProps({
      mod: "sk-other-class", className: "my-custom-class"
    })

    expect(this.wrapper.find(".sk-other-class").hasClass("my-custom-class")).toBe(true)
  })

})
