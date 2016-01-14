import * as React from "react";
import {mount, spyLifecycle, shallow} from "enzyme";
import * as TestUtils from 'react-addons-test-utils';
import {RefinementListFilter} from "../src/RefinementListFilter.tsx";
import {SearchkitProvider, SearchkitManager } from "../../../../../core";
const bem = require("bem-cn");

fdescribe("Refinement List Filter tests", () => {

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
            value:4
          }
        }
      }
    })
  });

  it('renders correctly', () => {
    expect(this.wrapper.find("."+this.bemContainer("header")).text()).toBe("test")
    expect(this.wrapper.find("."+this.bemContainer("options")).children().map(
      (n) => {
        return {
          label: n.find("."+this.bemOption("text")).text(),
          count: n.find("."+this.bemOption("count")).text()
        }
      })).toEqual([ {label:'test option 1 translated', count:"1"},  {label:'test option 2', count:"2"},  {label:'test option 3', count:"3"} ])
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
