import * as React from "react";
import {mount} from "enzyme";
import {GroupedSelectedFilters} from "./GroupedSelectedFilters";
import {SearchkitManager, ImmutableQuery, FastClick} from "../../../../core";
const bem = require("bem-cn");
import * as _ from "lodash"
import * as sinon from "sinon";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../__test__/TestHelpers"

describe("GroupedSelectedFilters tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()

    this.searchkit.translateFunction = (key)=> {
      return {
        "test name 2":"test name 2 translated",
        "test value 2": "test value 2 translated"
      }[key]
    }

    this.createWrapper = (props) => {

      this.wrapper = mount(
        <GroupedSelectedFilters searchkit={this.searchkit} {...props} />
      );
    }

    this.remove1 = jasmine.createSpy("remove_1")
    this.remove2 = jasmine.createSpy("remove_2")
    this.remove3 = jasmine.createSpy("remove_3")

    this.searchkit.query = new ImmutableQuery()
      .addSelectedFilter({
        id:"test",
        name:"test name",
        value:"test value",
        remove: this.remove1
      }).addSelectedFilter({
        id:"test2",
        name:"test name 2",
        value:"test value 2",
        remove: this.remove2
      }).addSelectedFilter({
        id:"test",
        name:"test name",
        value:"test value 3",
        remove: this.remove3
      })
  });

  it('renders correctly', () => {

    this.createWrapper()

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-filter-groups">
        <div className="sk-filter-group filter-group-test">
          <div className="sk-filter-group-items">
            <div className="sk-filter-group-items__title">test name</div>
            <div className="sk-filter-group-items__list">
              <div className="sk-filter-group-items__value" data-key="test value">test value</div>
              <div className="sk-filter-group-items__value" data-key="test value 3">test value 3</div>
            </div>
          </div>
          <div className="sk-filter-group__remove-action">X</div>
        </div>
        <div className="sk-filter-group filter-group-test2">
          <div className="sk-filter-group-items">
            <div className="sk-filter-group-items__title">test name 2 translated</div>
            <div className="sk-filter-group-items__list">
              <div className="sk-filter-group-items__value" data-key="test value 2">test value 2 translated</div>
            </div>
          </div>
          <div className="sk-filter-group__remove-action">X</div>
        </div>
      </div>
    ))
  });

  it("handles remove click", () => {
    this.createWrapper()
    let elem = this.wrapper.find(".sk-filter-group-items__value").at(0)
    fastClick(elem)
    expect(this.remove1).toHaveBeenCalled();
    expect(this.remove2).not.toHaveBeenCalled();
    expect(this.remove3).not.toHaveBeenCalled();
  })

  it("handles remove all click", () => {
    this.createWrapper()
    let elem = this.wrapper.find(".sk-filter-group__remove-action").at(0)
    fastClick(elem)
    expect(this.remove1).toHaveBeenCalled();
    expect(this.remove2).not.toHaveBeenCalled();
    expect(this.remove3).toHaveBeenCalled();
  })
});
