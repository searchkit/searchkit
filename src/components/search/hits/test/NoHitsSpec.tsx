import * as React from "react";
import {mount} from "enzyme";
import {NoHits} from "../src/NoHits";
import {SearchkitManager} from "../../../../core";
import * as _ from "lodash";
import * as sinon from "sinon";

describe("NoHits component", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:false})

    this.createWrapper = () => {
      this.wrapper = mount(
        <NoHits searchkit={this.searchkit} translations={{"NoHits.NoResultsFound":"no movies"}} suggestionsField={"title"}/>
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

  describe("suggestions", () => {
    it("suggest text", () => {
      this.createWrapper()
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
      expect(this.wrapper.find('.no-hits__steps').text())
        .toEqual("Search for matrix")
    })

    fit("suggest remove filters", () => {
      this.createWrapper()
      // this.searchkit.getSelectedFilters = () => {
      //   return [{}]
      // }

      this.searchkit.query = this.searchkit.query.addFilter({})
      this.searchkit.query = this.searchkit.query.setQueryString("matrix")

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
      expect(this.wrapper.find('.no-hits__steps').text())
        .toBe("Search for matrix without filters")
    })


  })

});
