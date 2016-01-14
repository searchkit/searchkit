import * as React from "react";
import {mount} from "enzyme";
import {HitsStats} from "../src/HitsStats.tsx";
import {SearchkitManager} from "../../../../core";

describe("HitsStats tests", () => {

  beforeEach(() => {
    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:false})

    this.createWrapper = () => {

      this.wrapper = mount(
        <HitsStats searchkit={this.searchkit} translations={{"ResultsFound":"movies found"}} />
      );

    }

  });

  it('renders correctly', () => {
    this.searchkit.setResults({
      hits:{
        total:10
      }
    })
    this.createWrapper()
    expect(this.wrapper.find(".hits-stats__info").text()).toEqual("10 movies found")
  })


});
