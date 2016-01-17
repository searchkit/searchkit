import * as React from "react";
import {mount} from "enzyme";
import {NoHits} from "../src/NoHits";
import {SearchkitManager} from "../../../../core";
import * as _ from "lodash";
import * as sinon from "sinon";

fdescribe("NoHits component", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:false})

    this.createWrapper = () => {
      this.wrapper = mount(
        <NoHits searchkit={this.searchkit} translations={{"NoHits.NoResultsFound":"no movies"}}/>
      )
    }

  });


  describe('renders correctly', () => {

    beforeEach(() => {
      this.createWrapper()
      this.hasRendered = () => {
        return this.wrapper.find(".no-hits").length == 1
      }
    })

    it("doesn't render on initial load", () => {
      this.searchkit.initialLoading = true
      this.wrapper.update()
      expect(this.hasRendered()).toBeFalsy()
    })

    it("doesn't render on hits", () => {
      this.searchkit.initialLoading = false
      this.searchkit.setResults({
        hits:{
          hits:[1,2,3],
          total:3
        }
      })
      this.wrapper.update()
      expect(this.hasRendered()).toBeFalsy()

    })

    it("doesn't render on loading", () => {
      this.searchkit.isLoading = () => { return true }
      this.wrapper.update()
      expect(this.hasRendered()).toBeFalsy()
    })

    it("renders on no hits", () => {

      this.searchkit.setResults({
        hits:{
          hits:[],
          total:0
        }
      })
      this.wrapper.update()
      expect(this.hasRendered()).toBeTruthy()
      expect(this.wrapper.find('.no-hits__info').text())
        .toBe("no movies")

    })

  });
});
