import * as React from "react";
import {mount} from "enzyme";
import {DynamicRangeFilter} from "./DynamicRangeFilter";
import {SearchkitManager, DynamicRangeAccessor} from "../../../../core";
import {
  fastClick, hasClass, printPrettyHtml
} from "../../../__test__/TestHelpers"

describe("Dynamic Range Filter tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.rangeFormatter = (count) => count + " score"
    this.createWrapper = () => {
      this.wrapper = mount(
        <DynamicRangeFilter
          id="m"
          searchkit={this.searchkit}
          field="metascore"
          title="metascore"
          rangeFormatter={this.rangeFormatter}
          translations = {{"range.divider":" TO "}}
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
      this.accessor = this.searchkit.getAccessorByType(DynamicRangeAccessor)
    }

  });

  it("renders correctly", () => {
    this.createWrapper()
    expect(this.wrapper).toMatchSnapshot()
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
      },
      rangeFormatter:this.rangeFormatter,
      translations:{"range.divider":" TO "}
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
