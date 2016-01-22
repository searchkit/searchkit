import * as React from "react";
import {mount} from "enzyme";
import {hasClass} from "../../../../__test__/TestHelpers"
import {HierarchicalRefinementFilter} from "../src/HierarchicalRefinementFilter.tsx";
import {SearchkitManager} from "../../../../../core";
const bem = require("bem-cn");
const _ = require("lodash")
import * as sinon from "sinon";

describe("Refinement List Filter tests", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:true})

    this.createWrapper = () => {

      this.wrapper = mount(
        <HierarchicalRefinementFilter
          field="test" id="testid" title="test title"
          searchkit={this.searchkit} />
      );

      this.searchkit.setResults({
        aggregations: {
          testid:{
            children:{
              lvl0:{
                children:{
                  buckets:[
                    {key:"option1", doc_count:1},
                    {key:"option2", doc_count:2}
                  ]
                }
              }
            }
          }
        }
      })

      this.wrapper.update()

      this.accessor = this.searchkit.accessors.getAccessors()[0]

    }

    this.getContainer = (label, index) => {
      let container = this.wrapper.find(".hierarchical-refinement-list__"+label)
      if (_.isNumber(index)) {
        return container.children().at(index)
      } else {
        return container;
      }
    }

  });

  it("should render correctly", () => {
    this.createWrapper()
    this.wrapper.update()
    expect(this.getContainer("header").text()).toBe("test title")
    expect(this.getContainer("hierarchical-options").children().map(
      (n) => {
        return {
          label: n.find(".hierarchical-refinement-option__text").text(),
          count: n.find(".hierarchical-refinement-option__count").text()
        }
      })).toEqual([ {label:'option1', count:"1"}, {label:"option2", count:"2"}])
  })

  it("should configure accessor correctly", ()=> {
    this.createWrapper()

    expect(this.accessor.key).toBe("testid")
    let options = this.accessor.options
    expect(options).toEqual({
      "id": "testid",
      "title": "test title",
      "field":"test"
    })

  })

});
