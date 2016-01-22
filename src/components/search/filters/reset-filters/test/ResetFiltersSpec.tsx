import * as React from "react";
import {mount} from "enzyme";
import {ResetFilters} from "../src/ResetFilters.tsx";
import {SearchkitManager} from "../../../../../core";

import * as sinon from "sinon";

describe("Reset Filter tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()

    this.createWrapper = () => {
      this.wrapper = mount(
        <ResetFilters searchkit={this.searchkit} translations={{"reset.clear_all":"reset filters"}}/>
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
    expect(this.searchkit.resetState.called).toBeFalsy()
    expect(this.searchkit.performSearch.called).toBeFalsy()
    elem.simulate("mouseDown", {button:0})
    expect(this.searchkit.resetState.called).toBeTruthy()
    expect(this.searchkit.performSearch.called).toBeTruthy()
  })


});
