import * as React from "react";
import {mount} from "enzyme";
import {NoHits} from "../src/NoHits";
import {SearchkitManager} from "../../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../__test__/TestHelpers"

import * as sinon from "sinon";

describe("NoHits component", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.queryAccessor = this.searchkit.getQueryAccessor()
    spyOn(this.queryAccessor, "setQueryString")
    spyOn(this.queryAccessor, "keepOnlyQueryState")
    this.createWrapper = () => {
      this.wrapper = mount(
        <NoHits searchkit={this.searchkit} translations={{"NoHits.NoResultsFound":"no movies", "NoHits.Error":"error"}} suggestionsField={"title"}/>
      )
    }

  });


  describe('renders correctly', () => {

    beforeEach(() => {
      this.createWrapper()
      this.hasRendered = () => {
        return this.wrapper.find(".sk-no-hits").length == 1
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
      expect(this.wrapper.find('.sk-no-hits__info').text())
        .toBe("no movies")

    })

  });

  describe("suggestions", () => {
    it("suggest text", () => {
      this.createWrapper()
      this.searchkit.query = this.searchkit.query.setQueryString("matrixx")
      this.searchkit.setResults({
        hits:{
          hits:[],
          total:0
        },
        suggest:{
          suggestions:[
            {
              options:[
                {
                  text:"matrix"
                }
              ]
            }
          ]
        }
      })

      this.wrapper.update()
      expect(this.wrapper.find(".sk-no-hits__info").text())
        .toEqual("No results found for matrixx. Did you mean matrix?")
      expect(this.wrapper.find('.sk-no-hits__steps').text())
        .toEqual("Search for matrix instead")
      fastClick(this.wrapper.find(".sk-no-hits__step-action"))
      expect(this.queryAccessor.setQueryString)
        .toHaveBeenCalledWith("matrix", true)
      expect(this.searchkit.performSearch)
        .toHaveBeenCalledWith(true)
    })

    it("suggest remove filters", () => {
      this.createWrapper()

      this.searchkit.query = this.searchkit.query.addFilter({}).setQueryString("matrix")

      this.searchkit.setResults({
        aggregations:{
          "no_filters_top_hits":{
            hits:{
              total:1
            }
          }
        },
        hits:{
          hits:[],
          total:0
        }
      })

      this.wrapper.update()
      expect(this.wrapper.find('.sk-no-hits__steps').text())
        .toBe("Search for matrix without filters")
      fastClick(this.wrapper.find(".sk-no-hits__step-action"))
      expect(this.queryAccessor.keepOnlyQueryState)
        .toHaveBeenCalled()
      expect(this.searchkit.performSearch).toHaveBeenCalled()
    })

    it("render error", () => {
      this.createWrapper()
      this.searchkit.query = this.searchkit.query.addFilter({}).setQueryString("matrix")
      this.searchkit.setError("simulated error")
      this.wrapper.update()
      expect(this.wrapper.html()).toEqual(jsxToHTML(
<div data-qa="no-hits" className="sk-no-hits">
  <div className="sk-no-hits__info">error</div>
  <div className="sk-no-hits__steps">
    <div className="sk-no-hits__step-action">Reset Search</div>
  </div>
</div>
      ))


    })


  })

});
