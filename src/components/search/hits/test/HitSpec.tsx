import * as React from "react";
import {mount} from "enzyme";
import {Hits} from "../src/Hits";
import {SearchkitManager} from "../../../../core";

import * as sinon from "sinon";

describe("Hits component", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()

    this.wrapper = mount(
      <Hits searchkit={this.searchkit} hitsPerPage={10} highlightFields={["title"]}/>
    )

    this.pageSizeAccessor = this.searchkit.accessors.accessors[0]
    this.hitsAccessor = this.searchkit.accessors.accessors[1]

  });

  it("initalize accessors correctly", ()=> {
    expect(this.pageSizeAccessor.size).toBe(10)
    expect(this.hitsAccessor.highlightFields)
      .toEqual({
         fields: { title:{}}
      })
  })


  describe('renders correctly', () => {

    beforeEach(() => {
      this.hasRendered = () => {
        return this.wrapper.find(".hits").length == 1
      }
    })

    it("does render", () => {
      this.searchkit.initialLoading = false
      this.searchkit.setResults({
        hits:{
          hits:[{_id:1, title:1},{_id:2,title:2}],
          total:2
        }
      })
      this.wrapper.update()
      expect(this.hasRendered()).toBeTruthy()
    })

    it("does not render on no hits", () => {
      this.searchkit.initialLoading = false
      this.searchkit.setResults({
        hits:{
          hits:[],
          total:0
        }
      })
      this.wrapper.update()
      expect(this.hasRendered()).toBeFalsy()
    })

    it("does render on initial view", () => {
      this.searchkit.initialLoading = true
      this.wrapper.update()
      expect(this.hasRendered()).toBeTruthy()
      expect(this.wrapper.find(".hits__initial-loading").length).toBe(1)
    })
  })

});
