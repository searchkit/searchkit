import * as React from "react";
import {mount, spyLifecycle, shallow} from "enzyme";
import * as TestUtils from 'react-addons-test-utils';
import {RefinementListFilter} from "../src/RefinementListFilter.tsx";
import {SearchkitProvider, SearchkitManager } from "../../../../../core";

describe("Refinement List Filter tests", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:true})
    this.searchkit.translateFunction = (key)=> {
      return {
        "test option 1":"test option 1 translated"
      }[key]
    }

    this.wrapper = mount(
      <RefinementListFilter
        field="test" id="test" title="test"
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
            value:3
          }
        }
      }
    })
  });

  it('renders correctly', () => {
    expect(this.wrapper.find(".refinement-list__header").text()).toBe("test")
    expect(this.wrapper.find(".refinement-list__options").children().map(
      (n) => {
        return n.find(".refinement-list-option__text").text()
      })).toEqual([ 'test option 1 translated', 'test option 2', 'test option 3' ])
  });

  it("should configure accessor correctly", ()=> {
    let options = this.searchkit.accessors.getAccessors()[0].options
    expect(options).toEqual({
      "id": "test",
      "title": "test",
      "size": 50,
      "facetsPerPage": 50,
      "operator":undefined,
      "translations":undefined
    })

  })

});
