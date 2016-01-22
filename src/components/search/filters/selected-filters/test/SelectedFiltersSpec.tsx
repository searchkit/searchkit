import * as React from "react";
import {mount} from "enzyme";
import {SelectedFilters} from "../src/SelectedFilters.tsx";
import {SearchkitManager, ImmutableQuery } from "../../../../../core";
const bem = require("bem-cn");
const _ = require("lodash")
import * as sinon from "sinon";

describe("SelectedFilters tests", () => {

  beforeEach(() => {

    this.bemContainer = bem("selected-filters")
    this.bemOption = bem("selected-filters-option")

    this.searchkit = SearchkitManager.mock()

    this.searchkit.translateFunction = (key)=> {
      return {
        "test name 2":"test name 2 translated",
        "test value 2": "test value 2 translated"
      }[key]
    }

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

    this.sinonSpy = sinon.spy();

    this.searchkit.query = new ImmutableQuery()
      .addSelectedFilter({
        id:"test",
        name:"test name",
        value:"test value",
        remove: this.sinonSpy
      }).addSelectedFilter({
        id:"test2",
        name:"test name 2",
        value:"test value 2",
        remove:_.identity
      })


  });

  it('renders correctly', () => {

    this.createWrapper()

    expect(this.getContainer(null).children().map((n) => {
      return n.children().at(0).text()
    })).toEqual([
      "test name: test value",
      "test name 2 translated: test value 2 translated"
    ])


  });

  it("handles remove click", () => {
    this.createWrapper()
    let elem = this.getContainer(null,0).find("."+this.bemOption("remove-action"))
    elem.simulate("mouseDown", {button:0})
    expect(this.sinonSpy.called).toBeTruthy()
  })


});
