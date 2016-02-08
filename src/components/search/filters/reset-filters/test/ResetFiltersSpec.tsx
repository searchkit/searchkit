import * as React from "react";
import {mount} from "enzyme";
import {ResetFilters} from "../src/ResetFilters.tsx";
import {SearchkitManager, ImmutableQuery} from "../../../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../../__test__/TestHelpers"

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
    this.searchkit.query.getSelectedFilters = () => {return []}
    let elem = this.wrapper.find(".reset-filters")

    this.wrapper.update()
    expect(elem.hasClass("is-disabled")).toBe(true)

    this.searchkit.query.getSelectedFilters = () => {return [1]}

    this.wrapper.update()
    expect(elem.hasClass("is-disabled")).toBe(false)

    expect(elem.text()).toBe("reset filters")
  });

  it("handles reset click", () => {
    this.searchkit.query.getSelectedFilters = () => {return [1]}
    this.searchkit.resetState = sinon.spy()
    this.searchkit.performSearch = sinon.spy()
    this.createWrapper()
    let elem = this.wrapper.find(".reset-filters")
    expect(this.searchkit.resetState.called).toBeFalsy()
    expect(this.searchkit.performSearch.called).toBeFalsy()
    fastClick(elem)
    expect(this.searchkit.resetState.called).toBeTruthy()
    expect(this.searchkit.performSearch.called).toBeTruthy()
  })

  it("hasFilters()", ()=> {
    this.createWrapper()
    let resetFilters = this.wrapper.node
    expect(resetFilters.hasFilters()).toBe(false)
    this.searchkit.query = new ImmutableQuery().setQueryString("foo")
    expect(resetFilters.hasFilters()).toBe(true)
    this.searchkit.query = new ImmutableQuery().addSelectedFilter({
      id:"test", name:"testName", value:"testValue", remove:()=>{}
    })
    expect(resetFilters.hasFilters()).toBe(true)

  })



});
