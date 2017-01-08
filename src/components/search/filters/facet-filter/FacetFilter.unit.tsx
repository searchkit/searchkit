import * as React from "react"
import {mount, render} from "enzyme"
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../__test__/TestHelpers"
import {FacetFilter} from "./FacetFilter"
import {RefinementListFilter} from "./RefinementListFilter"
import {SearchkitManager, Utils, FieldOptions} from "../../../../core"
import {Toggle, ItemComponent} from "../../../ui"
const bem = require("bem-cn")
import * as _ from "lodash"
import * as sinon from "sinon"

describe("Facet Filter tests", () => {
  this.createWrapper = (component) => {
    this.wrapper = mount(component)

    this.searchkit.setResults({
      aggregations: {
        test1: {
          test: {
            buckets: [
              { key: "test option 1", doc_count: 1 },
              { key: "test option 2", doc_count: 2 },
              { key: "test option 3", doc_count: 3 }
            ]
          },
          "test_count": {
            value: 4
          }
        }
      }
    })

    this.accessor = this.searchkit.accessors.getAccessors()[0]
  }

  beforeEach(() => {
    Utils.guidCounter = 0


    this.searchkit = SearchkitManager.mock()
    this.searchkit.translateFunction = (key) => {
      return {
        "test option 1": "test option 1 translated"
      }[key]
    }

    this.createWrapper(
      <FacetFilter
        field="test" id="test id" title="test title" size={3} countFormatter={(count)=>"#"+count}
        include={"title"} exclude={["bad", "n/a"]} operator="OR"
        orderKey="_count" orderDirection="desc" translations={{"facets.view_all":"View all facets"}}
        searchkit={this.searchkit} bucketsTransform={_.identity}/>
    )

    this.getViewMore = ()=> this.wrapper.find(".sk-refinement-list__view-more-action")


  });

  it('renders correctly', () => {
    let output = jsxToHTML(
      <div className="sk-panel filter--test id">
        <div className="sk-panel__header">test title</div>
        <div className="sk-panel__content">
          <div data-qa="options" className="sk-item-list">
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="test option 1"><input type="checkbox" data-qa="checkbox" readOnly={true} className="sk-item-list-option__checkbox" value="on"/>
              <div data-qa="label" className="sk-item-list-option__text">test option 1 translated</div>
              <div data-qa="count" className="sk-item-list-option__count">#1</div>
            </div>
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="test option 2"><input type="checkbox" data-qa="checkbox" readOnly={true} className="sk-item-list-option__checkbox" value="on"/>
              <div data-qa="label" className="sk-item-list-option__text">test option 2</div>
              <div data-qa="count" className="sk-item-list-option__count">#2</div>
            </div>
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="test option 3"><input type="checkbox" data-qa="checkbox" readOnly={true} className="sk-item-list-option__checkbox" value="on"/>
              <div data-qa="label" className="sk-item-list-option__text">test option 3</div>
              <div data-qa="count" className="sk-item-list-option__count">#3</div>
            </div>
          </div>
          <div data-qa="show-more" className="sk-refinement-list__view-more-action">View all facets</div>
        </div>
      </div>
    )

    expect(this.wrapper.html()).toEqual(output)

  });

  it('clicks options', () => {
    let option = this.wrapper.find(".sk-item-list").children().at(0)
    let option2 = this.wrapper.find(".sk-item-list").children().at(1)
    fastClick(option)
    fastClick(option2)
    expect(hasClass(option, "is-active")).toBe(true)
    expect(hasClass(option2, "is-active")).toBe(true)
    expect(this.accessor.state.getValue()).toEqual(['test option 1', 'test option 2'])
    fastClick(option2)
    expect(this.accessor.state.getValue()).toEqual(['test option 1'])
  })

  it("show more options", () => {
    let option = {label:"view more", size:20}
    this.accessor.getMoreSizeOption = () => {return option}
    this.accessor.setViewMoreOption = sinon.spy()
    this.wrapper.update()
    let viewMore = this.getViewMore()
    expect(viewMore.text()).toBe("view more")
    fastClick(viewMore)
    this.wrapper.update()
    expect(this.accessor.setViewMoreOption.calledOnce).toBe(true)
    expect(this.accessor.setViewMoreOption.calledWith(option)).toBe(true)
  })

  it("show no options", () => {
    this.accessor.getMoreSizeOption = () => {return null}
    this.wrapper.update()
    expect(this.getViewMore().length).toBe(0)
  })

  it("should configure accessor correctly", () => {
    expect(this.accessor.key).toBe("test")
    let options = this.accessor.options

    expect(options).toEqual(jasmine.objectContaining({
      "id": "test id",
      "field":"test",
      "title": "test title",
      "size": 3,
      "facetsPerPage": 50,
      "operator": "OR",
      "translations": {"facets.view_all":"View all facets"},
      "orderKey":"_count",
      "orderDirection":"desc",
      "include":"title",
      "exclude":["bad","n/a"],
      "fieldOptions":{
        type:"embedded",
        field:"test"
      }
    }))
  })

  it("should work with a custom itemComponent", () => {
    this.createWrapper(
      <FacetFilter
        itemComponent = {({ label, count }) => <div className="option">{label} ({count})</div>}
        field="test" id="test id" title="test title"
        searchkit={this.searchkit} />
    )
    expect(this.wrapper.find(".sk-panel__header").text()).toBe("test title")
    expect(this.wrapper.find(".option").map(e => e.text()))
      .toEqual(["test option 1 translated (1)", "test option 2 (2)", "test option 3 (3)"])

  })

  it("operator can be updated", ()=> {
    spyOn(this.searchkit, "performSearch")
    this.wrapper.setProps({operator:"AND"})
    expect(this.accessor.options.operator).toBe("AND")
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

  it("setFilters", ()=> {
    spyOn(this.searchkit, "performSearch")
    this.wrapper.node.setFilters(["foo"])
    expect(this.accessor.state.getValue()).toEqual(["foo"])
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

  it("should work with custom components", () => {
    let container = (props)=> (
      <div {...props}>{props.children}</div>
    )

    this.createWrapper(
      <RefinementListFilter
        containerComponent={container}
        listComponent={Toggle}
        itemComponent={(props)=> <ItemComponent {...props} showCount={true}/>}
        field="test" id="test id" title="test title"
        bucketsTransform={(buckets)=> _.reverse(buckets)}
        searchkit={this.searchkit} />
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div title="test title" className="filter--test id">
        <div data-qa="options" className="sk-toggle">
          <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="test option 3">
            <div data-qa="label" className="sk-toggle-option__text">test option 3</div>
            <div data-qa="count" className="sk-toggle-option__count">3</div>
          </div>
          <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="test option 2">
            <div data-qa="label" className="sk-toggle-option__text">test option 2</div>
            <div data-qa="count" className="sk-toggle-option__count">2</div>
          </div>
          <div className="sk-toggle-option sk-toggle__item" data-qa="option" data-key="test option 1">
            <div data-qa="label" className="sk-toggle-option__text">test option 1 translated</div>
            <div data-qa="count" className="sk-toggle-option__count">1</div>
          </div>
        </div>
        <div data-qa="show-more" className="sk-refinement-list__view-more-action">View all facets</div>
      </div>
    ))
  })

});
