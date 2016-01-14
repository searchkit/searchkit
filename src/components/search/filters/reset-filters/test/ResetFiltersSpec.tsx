import * as React from "react";
import {mount} from "enzyme";
import {ResetFilters} from "../src/ResetFilters.tsx";
import {SearchkitManager } from "../../../../../core";
const bem = require("bem-cn");
import * as _ from "lodash";
import * as sinon from "sinon";

describe("Refinement List Filter tests", () => {

  beforeEach(() => {

    this.bemContainer = bem("refinement-list")
    this.bemOption = bem("refinement-list-option")

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:true})
    this.searchkit.translateFunction = (key)=> {
      return {
        "ClearAllFilters":"reset filters"
      }[key]
    }

    this.createWrapper = () => {

      this.wrapper = mount(
        <ResetFilters searchkit={this.searchkit} />
      );

    }

  });

  it('renders correctly', () => {
    this.createWrapper()
    this.searchkit.query.hasFiltersOrQuery = () => {return false}
    let elem = this.wrapper.find(".reset-filters")

    this.wrapper.update()
    expect(elem.hasClass("is-disabled")).toBe(true)

    this.searchkit.query.hasFiltersOrQuery = () => {return true}

    this.wrapper.update()
    expect(elem.hasClass("is-disabled")).toBe(false)

    expect(elem.text()).toBe("reset filters")
  });

  it("handles reset click", () => {
    this.searchkit.query.hasFiltersOrQuery = () => {return true}
    this.searchkit.resetState = sinon.spy()
    this.searchkit.performSearch = sinon.spy()
    this.createWrapper()
    let elem = this.wrapper.find(".reset-filters")
    elem.simulate("mouseDown", {button:0})
    expect(this.searchkit.resetState.called).toBeTruthy()
    expect(this.searchkit.performSearch.called).toBeTruthy()
  })


});
