import * as React from "react";
import {mount} from "enzyme";
import {ViewSwitcherToggle} from "./ViewSwitcherToggle";
import {ViewSwitcherHits} from "./ViewSwitcherHits";

import {SearchkitManager} from "../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../__test__/TestHelpers"

const map = require("lodash/map")

describe("View Switcher Hits component", () => {

  describe('renders correctly', () => {

    beforeEach(() => {

      this.searchkit = SearchkitManager.mock()

      const MovieHitsGridItem = (props) => {
        return (
          <div className="grid-item">{props.result.title}</div>
        )
      }

      const MovieHitsListItem = (props) => {
        return (
          <div className="list-item">{props.result.title}</div>
        )
      }

      const MovieList = (props)=> {
        return (
          <div className="custom-list">
            {map(props.hits, "_id").join(",")}
          </div>
        )
      }

      this.searchkit.setResults({
        hits:{
          hits:[{_id:1, title:1},{_id:2,title:2}],
          total:2
        }
      })

      this.wrapper = mount(
        <div>

          <ViewSwitcherHits searchkit={this.searchkit}
                hitComponents = {[
                  {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem, defaultOption:true},
                  {key:"list", title:"List", itemComponent:MovieHitsListItem},
                  {key:"custom-list", title:"Custom List", listComponent:MovieList}
                ]}
                highlightFields={["title"]}
                hitsPerPage={12}
                sourceFilter={["title"]}/>
          <ViewSwitcherToggle searchkit={this.searchkit}/>

        </div>
      )

      this.ViewOptionsAccessor = this.searchkit.accessors.accessors[0]

    });

    it("View Switcher Hits", ()=> {
      expect(this.wrapper.html()).toEqual(jsxToHTML(
        <div>
          <div data-qa="hits" className="sk-hits-grid">
            <div className="grid-item">1</div>
            <div className="grid-item">2</div>
          </div>
          <div className="sk-view-switcher">
            <div className="sk-view-switcher__action is-active">Grid</div>
            <div className="sk-view-switcher__action">List</div>
            <div className="sk-view-switcher__action">Custom List</div>
          </div>
        </div>
      ))

      fastClick(this.wrapper.find(".sk-view-switcher__action").at(1))
      this.wrapper.update()

      expect(this.wrapper.html()).toEqual(jsxToHTML(
        <div>
          <div data-qa="hits" className="sk-hits-list">
            <div className="list-item">1</div>
            <div className="list-item">2</div>
          </div>
          <div className="sk-view-switcher">
            <div className="sk-view-switcher__action">Grid</div>
            <div className="sk-view-switcher__action is-active">List</div>
            <div className="sk-view-switcher__action">Custom List</div>
          </div>
        </div>
      ))

      fastClick(this.wrapper.find(".sk-view-switcher__action").at(2))

      expect(this.wrapper.html()).toEqual(jsxToHTML(
        <div>
          <div className="custom-list">1,2</div>
          <div className="sk-view-switcher">
            <div className="sk-view-switcher__action">Grid</div>
            <div className="sk-view-switcher__action">List</div>
            <div className="sk-view-switcher__action is-active">Custom List</div>
          </div>
        </div>
      ))
    })

  })

})
