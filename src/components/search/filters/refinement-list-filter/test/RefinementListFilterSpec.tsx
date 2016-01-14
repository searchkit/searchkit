import * as React from "react";
import {mount, spyLifecycle} from "enzyme";
import * as TestUtils from 'react-addons-test-utils';
import {RefinementListFilter} from "../src/RefinementListFilter.tsx";
import {SearchkitProvider, SearchkitManager } from "../../../../../core";
const bem = require("bem-cn");

fdescribe("Refinement List Filter tests", () => {

  beforeEach(() => {

    this.bemContainer = bem("refinement-list")
    this.bemOption = bem("refinement-list-option")

    this.searchkit = new SearchkitManager("localhost:9200")

    this.wrapper = mount(
      <SearchkitProvider searchkit={this.searchkit}>
        <div>
          <RefinementListFilter field="test" id="test" title="test" size={2} />
        </div>
      </SearchkitProvider>
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
      })).toEqual([ {label:'test option 1', count:"1"},  {label:'test option 2', count:"2"},  {label:'test option 3', count:"3"} ])
  });

  // it("selects option", () => {
  //   let option1 = this.wrapper.ref("test option 1")
  //   // option1.simulate("click")
  //   expect(option1.text()).toEqual(true)
  // })

});
