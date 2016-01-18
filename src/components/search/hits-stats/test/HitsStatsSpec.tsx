import * as React from "react";
import {mount} from "enzyme";
import {HitsStats} from "../src/HitsStats.tsx";
import {SearchkitManager} from "../../../../core";

describe("HitsStats tests", () => {

  beforeEach(() => {
    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:false})

    this.createWrapper = (translations) => {

      this.wrapper = mount(
        <HitsStats searchkit={this.searchkit} translations={translations} />
      );

    }

  });

  it('renders correctly', () => {
    this.searchkit.setResults({
      hits:{
        total:10
      },
      took:10
    })
    this.createWrapper({"hitstats.results_found":"{hitCount} movies found"})
    expect(this.wrapper.find(".hits-stats__info").text()).toEqual("10 movies found")

    this.createWrapper()
    expect(this.wrapper.find(".hits-stats__info").text()).toEqual("10 results found in 10ms")
  })


});
