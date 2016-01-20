import * as React from "react";
import {mount} from "enzyme";
import {RangeFilter} from "../src/RangeFilter.tsx";
import {SearchkitManager} from "../../../../../core";
import * as _ from "lodash";
import * as sinon from "sinon";

describe("Reset Filter tests", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:true})

    this.createWrapper = () => {
      this.wrapper = mount(
        <RangeFilter
          id="m"
          searchkit={this.searchkit}
          field="metascore"
          min={0}
          max={100}
          title="metascore"
          showHistogram={true}/>
      );
    }

  });

  it('renders correctly', () => {
    this.createWrapper()
    this.searchkit.setResults({

    })
  });




});
