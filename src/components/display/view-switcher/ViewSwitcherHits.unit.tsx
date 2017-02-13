import * as React from "react";
import {mount} from "enzyme";
import {ViewSwitcherToggle} from "./ViewSwitcherToggle";
import {ViewSwitcherHits} from "./ViewSwitcherHits";
import {Select} from "../../ui";

import {SearchkitManager} from "../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../__test__/TestHelpers"

import {map} from "lodash"

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
      this.setWrapper = (props={})=> {
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
            <ViewSwitcherToggle searchkit={this.searchkit} translations={{"Grid":"My Grid"}} {...props}/>

          </div>
        )
      }

      this.ViewOptionsAccessor = this.searchkit.accessors.accessors[0]

    });

    it("View Switcher Hits", ()=> {
      this.setWrapper()
      expect(this.wrapper.html()).toEqual(jsxToHTML(
        <div>
          <div data-qa="hits" className="sk-hits-grid">
            <div className="grid-item">1</div>
            <div className="grid-item">2</div>
          </div>
          <div data-qa="options" className="sk-toggle">
            <div className="sk-toggle-option sk-toggle__item is-active" data-qa="option" data-key="grid">
              <div data-qa="label" className="sk-toggle-option__text">My Grid</div>
            </div>
            <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="list">
              <div data-qa="label" className="sk-toggle-option__text">List</div>
            </div>
            <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="custom-list">
              <div data-qa="label" className="sk-toggle-option__text">Custom List</div>
            </div>
          </div>
        </div>
      ))

      fastClick(this.wrapper.find(".sk-toggle-option").at(1))
      this.wrapper.update()


      expect(this.wrapper.html()).toEqual(jsxToHTML(
        <div>
          <div data-qa="hits" className="sk-hits-list">
            <div className="list-item">1</div>
            <div className="list-item">2</div>
          </div>
          <div data-qa="options" className="sk-toggle">
            <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="grid">
              <div data-qa="label" className="sk-toggle-option__text">My Grid</div>
            </div>
            <div className="sk-toggle-option sk-toggle__item is-active" data-qa="option" data-key="list">
              <div data-qa="label" className="sk-toggle-option__text">List</div>
            </div>
            <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="custom-list">
              <div data-qa="label" className="sk-toggle-option__text">Custom List</div>
            </div>
          </div>
        </div>
      ))

      fastClick(this.wrapper.find(".sk-toggle-option").at(2))

      expect(this.wrapper.html()).toEqual(jsxToHTML(
        <div>
          <div className="custom-list">1,2</div>
          <div data-qa="options" className="sk-toggle">
            <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="grid">
              <div data-qa="label" className="sk-toggle-option__text">My Grid</div>
            </div>
            <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="list">
              <div data-qa="label" className="sk-toggle-option__text">List</div>
            </div>
            <div className="sk-toggle-option sk-toggle__item is-active" data-qa="option" data-key="custom-list">
              <div data-qa="label" className="sk-toggle-option__text">Custom List</div>
            </div>
          </div>
        </div>
      ))
    })

    it("custom mod, className, listComponent", ()=> {
      this.setWrapper({
        mod:"my-view-switcher", className:"customClass",
        listComponent:Select
      })

      expect(this.wrapper.html()).toEqual(jsxToHTML(
        <div>
          <div data-qa="hits" className="sk-hits-grid">
            <div className="grid-item">1</div>
            <div className="grid-item">2</div>
          </div>
          <div className="my-view-switcher customClass">
            <select>
              <option value="grid">My Grid</option>
              <option value="list">List</option>
              <option value="custom-list">Custom List</option>
            </select>
          </div>
        </div>
      ))
    })


  })



})
