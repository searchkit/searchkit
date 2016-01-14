import * as React from "react";
import {mount} from "enzyme";
import {SelectedFilters} from "../src/SelectedFilters.tsx";
import {SearchkitManager } from "../../../../../core";
const bem = require("bem-cn");
import * as _ from "lodash";
import * as sinon from "sinon";

describe("SelectedFilters tests", () => {

  beforeEach(() => {

    this.bemContainer = bem("selected-filters")
    this.bemOption = bem("selected-filters-option")

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:true})

    this.getContainer = (label, index) => {
      let container = this.wrapper.find("."+this.bemContainer(label))
      if (_.isNumber(index)) {
        return container.children().at(index)
      } else {
        return container;
      }
    }

    this.createWrapper = () => {

      this.wrapper = mount(
        <SelectedFilters searchkit={this.searchkit} />
      );

    }

  });

  it('renders correctly', () => {

    this.searchkit.query.getSelectedFilters = () => {
      return [
        {
          name:"test name",
          value:"test value",
          remove: sinon.spy()
        }

      ]
    }

    this.createWrapper()

    expect(this.getContainer(null, 0).text()).toBe(true)

    // this.searchkit.query.hasFiltersOrQuery = () => {return false}
    // let elem = this.wrapper.find(".reset-filters")
    //
    // this.wrapper.update()
    // expect(elem.hasClass("is-disabled")).toBe(true)
    //
    // this.searchkit.query.hasFiltersOrQuery = () => {return true}
    //
    // this.wrapper.update()
    // expect(elem.hasClass("is-disabled")).toBe(false)
    //
    // expect(elem.text()).toBe("reset filters")
  });
  //
  // it("handles reset click", () => {
  //   this.searchkit.query.hasFiltersOrQuery = () => {return true}
  //   this.searchkit.resetState = sinon.spy()
  //   this.searchkit.performSearch = sinon.spy()
  //   this.createWrapper()
  //   let elem = this.wrapper.find(".reset-filters")
  //   elem.simulate("mouseDown", {button:0})
  //   expect(this.searchkit.resetState.called).toBeTruthy()
  //   expect(this.searchkit.performSearch.called).toBeTruthy()
  // })


});
