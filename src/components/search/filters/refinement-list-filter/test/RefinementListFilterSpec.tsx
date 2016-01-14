import * as React from "react";
import {mount, spyLifecycle} from "enzyme";
import * as TestUtils from 'react-addons-test-utils';
import {RefinementListFilter} from "../src/RefinementListFilter.tsx";
import {SearchkitProvider, SearchkitManager } from "../../../../../core";

fdescribe("Refinement List Filter tests", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200")

    this.wrapper = mount(
      <SearchkitProvider searchkit={this.searchkit}>
        <div>
          <RefinementListFilter field="test" id="test" title="test" />
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
      })).toEqual([ 'test option 1', 'test option 2', 'test option 3' ])
  });

});
