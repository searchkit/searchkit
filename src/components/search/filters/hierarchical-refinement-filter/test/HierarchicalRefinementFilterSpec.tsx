import * as React from "react";
import {mount} from "enzyme";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../../__test__/TestHelpers"
import {HierarchicalRefinementFilter} from "../src/HierarchicalRefinementFilter"
import {SearchkitManager} from "../../../../../core"
let bem = require("bem-cn")
import * as _ from "lodash"
import * as sinon from "sinon"

describe("Refinement List Filter tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.wrapper = mount(
      <HierarchicalRefinementFilter
        countFormatter={(count)=> "#"+count}
        field="test" id="testid" title="test title"
        searchkit={this.searchkit} />
    );
    this.accessor = this.searchkit.accessors.getAccessors()[0]

    this.setResults = ()=> {
      this.searchkit.setResults({
        aggregations: {
          testid:{
            children:{
              lvl0:{
                children:{
                  buckets:[
                    {key:"option1", doc_count:1},
                    {key:"option2", doc_count:2}
                  ]
                }
              },
              lvl1:{
                children:{
                  buckets:[
                    {key:"option2child1", doc_count:1},
                    {key:"option2child2", doc_count:1}
                  ]
                }
              }

            }
          }
        }
      })
    }

    this.getContainer = (label, index) => {
      let container = this.wrapper.find(".sk-hierarchical-refinement-list__"+label)
      if (_.isNumber(index)) {
        return container.children().at(index)
      } else {
        return container;
      }
    }

  });

  it("should configure accessor correctly", ()=> {
    expect(this.accessor.key).toBe("testid")
    let options = this.accessor.options
    expect(options).toEqual({
      "id": "testid",
      "title": "test title",
      "field":"test",
      "orderKey":undefined,
      "orderDirection":undefined,
      "startLevel":undefined
    })

  })
  it("should render correctly", () => {
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div data-qa="filter--testid" className="sk-hierarchical-refinement-list filter--testid">
        <div data-qa="title" className="sk-hierarchical-refinement-list__header">test title</div>
        <div data-qa="options" className="sk-hierarchical-refinement-list__root">
          <div className="sk-hierarchical-refinement-list__hierarchical-options">
            <div>
              <div className="sk-hierarchical-refinement-option">
                <div className="sk-hierarchical-refinement-option__text">option1</div>
                <div className="sk-hierarchical-refinement-option__count">#1</div>
              </div>
            </div>
            <div>
              <div className="sk-hierarchical-refinement-option">
                <div className="sk-hierarchical-refinement-option__text">option2</div>
                <div className="sk-hierarchical-refinement-option__count">#2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  })

  it("should render 2nd level and have 1 levels selected correctly", ()=> {
    this.accessor.state = this.accessor.state.setValue([
      ["option2"], ["option2child2"]
    ])
    this.setResults()
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div data-qa="filter--testid" className="sk-hierarchical-refinement-list filter--testid">
        <div data-qa="title" className="sk-hierarchical-refinement-list__header">test title</div>
        <div data-qa="options" className="sk-hierarchical-refinement-list__root">
          <div className="sk-hierarchical-refinement-list__hierarchical-options">
            <div>
              <div className="sk-hierarchical-refinement-option">
                <div className="sk-hierarchical-refinement-option__text">option1</div>
                <div className="sk-hierarchical-refinement-option__count">#1</div>
              </div>
            </div>
            <div>
              <div className="sk-hierarchical-refinement-option is-selected">
                <div className="sk-hierarchical-refinement-option__text">option2</div>
                <div className="sk-hierarchical-refinement-option__count">#2</div>
              </div>
              <div className="sk-hierarchical-refinement-list__hierarchical-options">
                <div>
                  <div className="sk-hierarchical-refinement-option">
                    <div className="sk-hierarchical-refinement-option__text">option2child1</div>
                    <div className="sk-hierarchical-refinement-option__count">#1</div>
                  </div>
                </div>
                <div>
                  <div className="sk-hierarchical-refinement-option is-selected">
                    <div className="sk-hierarchical-refinement-option__text">option2child2</div>
                    <div className="sk-hierarchical-refinement-option__count">#1</div>
                  </div>
                  <div className="sk-hierarchical-refinement-list__hierarchical-options"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  })

  it("handle clicking an option", ()=> {
    this.setResults()
    let option2 = this.wrapper
      .find(".sk-hierarchical-refinement-list__hierarchical-options")
      .children().at(1)
      .find(".sk-hierarchical-refinement-option")
    fastClick(option2)
    expect(this.accessor.state.getValue())
      .toEqual([ ["option2"] ])

  })

  it("should add disabled state when no results", ()=> {
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div data-qa="filter--testid" className="sk-hierarchical-refinement-list filter--testid is-disabled">
        <div data-qa="title" className="sk-hierarchical-refinement-list__header">test title</div>
        <div data-qa="options" className="sk-hierarchical-refinement-list__root">
          <div className="sk-hierarchical-refinement-list__hierarchical-options"></div>
        </div>
      </div>
    ))
  })

});
