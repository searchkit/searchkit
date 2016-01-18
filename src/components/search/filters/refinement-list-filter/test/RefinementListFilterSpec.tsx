import * as React from "react";
import {mount} from "enzyme";
import {hasClass} from "../../../../__test__/TestHelpers"
import {RefinementListFilter} from "../src/RefinementListFilter.tsx";
import {SearchkitManager} from "../../../../../core";
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
        "test option 1":"test option 1 translated"
      }[key]
    }

    this.wrapper = mount(
      <RefinementListFilter
        field="test" id="test id" title="test title"
        searchkit={this.searchkit} />
    );

    this.searchkit.setResults({
      aggregations: {
        test: {
          test: {
            buckets:[
              {key:"test option 1", doc_count:1},
              {key:"test option 2", doc_count:2},
              {key:"test option 3", doc_count:3}
            ]
          },
          "test.count":{
            value:4
          }
        }
      }
    })

    this.accessor = this.searchkit.accessors.getAccessors()[0]
    this.getContainer = (label, index) => {
      let container = this.wrapper.find("."+this.bemContainer(label))
      if (_.isNumber(index)) {
        return container.children().at(index)
      } else {
        return container;
      }
    }

  });

  it('renders correctly', () => {
    expect(this.getContainer("header").text()).toBe("test title")
    expect(this.getContainer("options").children().map(
      (n) => {
        return {
          label: n.find("."+this.bemOption("text")).text(),
          count: n.find("."+this.bemOption("count")).text()
        }
      })).toEqual([ {label:'test option 1 translated', count:"1"},  {label:'test option 2', count:"2"},  {label:'test option 3', count:"3"} ])
  });

  it('clicks options', () => {
    let option = this.getContainer("options", 0)
    let option2 = this.getContainer("options", 1).children().at(0)
    option.simulate("mouseDown", {button:0})
    option2.simulate("mouseDown", {button:0})
    expect(hasClass(option, "is-selected")).toBe(true)
    expect(hasClass(option2, "is-selected")).toBe(true)
    expect(this.accessor.state.getValue()).toEqual(['test option 1', 'test option 2'])
    option2.simulate("mouseDown", {button:0})
    this.wrapper.update()
    expect(this.accessor.state.getValue()).toEqual(['test option 1'])
  })

  it("show more options", () => {
    let option = {label:"view more", size:20}
    this.accessor.getMoreSizeOption = () => {return option}
    this.accessor.setViewMoreOption = sinon.spy()
    this.wrapper.update()
    expect(this.getContainer("view-more-action").text()).toBe("view more")
    this.getContainer("view-more-action").simulate("mouseDown", {button:0})
    this.wrapper.update()
    expect(this.accessor.setViewMoreOption.calledOnce).toBe(true)
    expect(this.accessor.setViewMoreOption.calledWith(option)).toBe(true)
  })

  it("show no options", () => {
    this.accessor.getMoreSizeOption = () => {return null}
    this.wrapper.update()
    expect(this.getContainer("view-more-action").length).toBe(0)
  })

  it("should configure accessor correctly", ()=> {
    expect(this.accessor.key).toBe("test")
    let options = this.accessor.options
    expect(options).toEqual({
      "id": "test id",
      "title": "test title",
      "size": 50,
      "facetsPerPage": 50,
      "operator":undefined,
      "translations":undefined
    })

  })

});
