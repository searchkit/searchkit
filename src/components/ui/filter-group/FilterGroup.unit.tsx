import * as React from "react";
import {mount} from "enzyme";
import {
  FilterGroup
} from "./FilterGroup"
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

describe("FilterGroup", ()=> {

  beforeEach(()=> {
    this.title = 'GroupTitle'
    this.removeFilter = jasmine.createSpy('removeFilter')
    this.removeFilters = jasmine.createSpy('removeFilters')
    this.translate = (str) => `${str} translated`
    this.filters = [
      {value: 'A'},
      {value: 'B'},
      {value: 'C'},
      {value: 'D'}
    ]
  })

  it("should render and behave correctly", ()=> {

    this.wrapper = mount(
      <FilterGroup title={this.title} translate={this.translate}
                   className="filter-group-1"
                   removeFilter={this.removeFilter} removeFilters={this.removeFilters}
                   filters={this.filters} />
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-filter-group filter-group-1">
        <div className="sk-filter-group-items">
          <div className="sk-filter-group-items__title">GroupTitle</div>
          <div className="sk-filter-group-items__list">
            <div className="sk-filter-group-items__value" data-key="A">A translated</div>
            <div className="sk-filter-group-items__value" data-key="B">B translated</div>
            <div className="sk-filter-group-items__value" data-key="C">C translated</div>
            <div className="sk-filter-group-items__value" data-key="D">D translated</div>
          </div>
        </div>
        <div className="sk-filter-group__remove-action">X</div>
      </div>
    ))

    expect(this.removeFilters).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-filter-group__remove-action"))
    expect(this.removeFilters).toHaveBeenCalledWith(this.filters)

    expect(this.removeFilter).not.toHaveBeenCalled()
    fastClick(this.wrapper.find(".sk-filter-group-items__value").at(2))
    expect(this.removeFilter).toHaveBeenCalledWith(this.filters[2])
  })

  it("mod + classname can be updated", () => {
    this.wrapper = mount(
      <FilterGroup mod="sk-filter-group-updated" className="my-custom-class"
                   title={this.title} translate={this.translate}
                   removeFilter={this.removeFilter} removeFilters={this.removeFilters}
                   filters={this.filters} />
    )

    expect(this.wrapper.find(".sk-filter-group-updated").hasClass("my-custom-class")).toBe(true)
  })

})
