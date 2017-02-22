import * as React from "react";
import {mount} from "enzyme";
import {HierarchicalMenuFilter} from "../src/HierarchicalMenuFilter";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../../__test__/TestHelpers"
import {SearchkitManager} from "../../../../../core";
const bem = require("bem-cn");
import * as sinon from "sinon";
import * as _ from "lodash"

describe("MenuFilter tests", () => {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.wrapper = mount(
      <HierarchicalMenuFilter searchkit={this.searchkit}
        title="Categories" id="categories" orderKey="_term" orderDirection="asc"
        countFormatter={(count)=> "#"+count}
        fields={["lvl1", "lvl2"]}
      />
    )
    this.accessor = this.searchkit.accessors.accessors[0]
    this.setResults = ()=> {
      this.searchkit.setResults({
        aggregations:{
          categories:{
            lvl1:{ lvl1:{ buckets: [
              {key:"Red", doc_count:10},
              {key:"Green", doc_count:20}
            ]}},
            lvl2:{ lvl2: { buckets:[
              {key:"Crimson", doc_count:10},
              {key:"Maroon", doc_count:12}
            ] }}
          }
        }
      })
    }
  })

  it("should set the correct accessor options", ()=> {
    expect(this.accessor.key).toBe("categories")
    expect(this.accessor.options).toEqual({
      id: 'categories', title: 'Categories',
      fields: ['lvl1', 'lvl2'], size: 20,
      orderKey:"_term", orderDirection:"asc"
    })
  })

  it("should render first level correctly", ()=> {
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-hierarchical-menu-list filter--categories">
        <div className="sk-hierarchical-menu-list__header">Categories</div>
        <div className="sk-hierarchical-menu-list__root">
          <div className="sk-hierarchical-menu-list__hierarchical-options">
            <div>
              <div className="sk-hierarchical-menu-option">
                <div className="sk-hierarchical-menu-option__text">Red</div>
                <div className="sk-hierarchical-menu-option__count">#10</div>
              </div>
            </div>
            <div>
              <div className="sk-hierarchical-menu-option">
                <div className="sk-hierarchical-menu-option__text">Green</div>
                <div className="sk-hierarchical-menu-option__count">#20</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  })

  it("should render 2nd level correctly with selected 3rd level", ()=> {
    this.accessor.state = this.accessor.state.setValue([
      ["Red"], ["Maroon"]
    ])
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-hierarchical-menu-list filter--categories">
        <div className="sk-hierarchical-menu-list__header">Categories</div>
        <div className="sk-hierarchical-menu-list__root">
          <div className="sk-hierarchical-menu-list__hierarchical-options">
            <div>
              <div className="sk-hierarchical-menu-option is-selected">
                <div className="sk-hierarchical-menu-option__text">Red</div>
                <div className="sk-hierarchical-menu-option__count">#10</div>
              </div>
              <div className="sk-hierarchical-menu-list__hierarchical-options">
                <div>
                  <div className="sk-hierarchical-menu-option">
                    <div className="sk-hierarchical-menu-option__text">Crimson</div>
                    <div className="sk-hierarchical-menu-option__count">#10</div>
                  </div>
                </div>
                <div>
                  <div className="sk-hierarchical-menu-option is-selected">
                    <div className="sk-hierarchical-menu-option__text">Maroon</div>
                    <div className="sk-hierarchical-menu-option__count">#12</div>
                  </div>
                  <div className="sk-hierarchical-menu-list__hierarchical-options"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="sk-hierarchical-menu-option">
                <div className="sk-hierarchical-menu-option__text">Green</div>
                <div className="sk-hierarchical-menu-option__count">#20</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  })

  it("should handle selecting an option", ()=> {
    this.setResults()
    let redOption = this.wrapper.find(".sk-hierarchical-menu-list__hierarchical-options")
      .children().at(0).find(".sk-hierarchical-menu-option")
    fastClick(redOption)
    expect(this.accessor.state.getValue()).toEqual([["Red"]])
  })

})
