import * as React from "react";
import {mount} from "enzyme";
import {ResetFilters} from "../src/ResetFilters";
import {SearchkitManager, ImmutableQuery, ResetSearchAccessor} from "../../../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../../__test__/TestHelpers"

import * as sinon from "sinon";

describe("Reset Filter tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    this.options = {query:true, filter:true}
    this.createWrapper = () => {
      this.wrapper = mount(
        <ResetFilters searchkit={this.searchkit}
          translations={{"reset.clear_all":"reset filters"}}
          options={this.options}
        />
      );
      this.accessor = this.searchkit.getAccessorsByType(ResetSearchAccessor)[0]
    }

  });

  it("should create accessor correctly", ()=> {
    this.createWrapper()
    expect(this.accessor).toBeTruthy()
    expect(this.accessor.options).toBe(this.options)
  })

  it('renders correctly', () => {
    this.createWrapper()
    this.searchkit.query.getSelectedFilters = () => {return []}
    let elem = this.wrapper.find(".sk-reset-filters")

    this.wrapper.update()
    expect(elem.hasClass("is-disabled")).toBe(true)

    this.searchkit.query.getSelectedFilters = () => {return [1]}

    this.wrapper.update()
    expect(elem.hasClass("is-disabled")).toBe(false)

    expect(elem.text()).toBe("reset filters")
  });

  it("handles reset click", () => {
    this.searchkit.query.getSelectedFilters = () => {return [1]}
    this.createWrapper()
    spyOn(this.accessor, "performReset")
    spyOn(this.searchkit, "performSearch")
    let elem = this.wrapper.find(".sk-reset-filters")
    expect(this.accessor.performReset).not.toHaveBeenCalled()
    expect(this.searchkit.performSearch).not.toHaveBeenCalled()
    fastClick(elem)
    expect(this.accessor.performReset).toHaveBeenCalled()
    expect(this.searchkit.performSearch).toHaveBeenCalled()

  })



});
