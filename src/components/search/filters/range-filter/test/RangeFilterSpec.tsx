import * as React from "react";
import {mount} from "enzyme";
import {RangeFilter} from "../src/RangeFilter.tsx";
import {SearchkitManager} from "../../../../../core";

import * as sinon from "sinon";

describe("Reset Filter tests", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:true})

    this.createWrapper = (withHistogram) => {
      this.wrapper = mount(
        <RangeFilter
          id="m"
          searchkit={this.searchkit}
          field="metascore"
          min={0}
          max={100}
          title="metascore"
          showHistogram={withHistogram}/>
      );

      this.searchkit.setResults({
        "aggregations": {
          "m": {
            "m": {
              "buckets": [
                {key:"10", count:1},
                {key:"20", count:3},
                {key:"30", count:1},
                {key:"40", count:1},
                {key:"50", count:1},
                {key:"60", count:5},
                {key:"70", count:1},
                {key:"80", count:1},
                {key:"90", count:1},
                {key:"100", count:1}

              ]
            }
          }
        }
      })

      this.wrapper.update()
    }


  });

  it('renders correctly', () => {
    this.createWrapper(true)

    expect(this.wrapper.find(".range-filter").hasClass("is-disabled")).toBe(false)
    expect(this.wrapper.find(".range-filter__header").text()).toBe("metascore")
    expect(this.wrapper.find(".range-filter-value-labels__min").text()).toBe("0")
    expect(this.wrapper.find(".range-filter-value-labels__max").text()).toBe("100")

    expect(this.wrapper.find(".bar-chart").length).toBe(1)
    expect(this.wrapper.find(".bar-chart__bar").length).toBe(10)

  });

  it("renders without histogram", () => {
    this.createWrapper(false)
    expect(this.wrapper.find(".bar-chart").length).toBe(0)
    expect(this.wrapper.find(".bar-chart__bar").length).toBe(0)
  })




});
