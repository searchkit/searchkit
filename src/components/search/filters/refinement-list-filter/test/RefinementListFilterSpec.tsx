import * as React from "react";
import {mount, render} from "enzyme";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../../__test__/TestHelpers"
import {RefinementListFilter} from "../src/RefinementListFilter.tsx";
import {SearchkitManager, Utils} from "../../../../../core";
const bem = require("bem-cn");
const _ = require("lodash")
import * as sinon from "sinon";

describe("Refinement List Filter tests", () => {
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
    this.getContainer = (label, index) => {
      let container = this.wrapper.find("." + this.bemContainer(label))
      if (_.isNumber(index)) {
        return container.children().at(index)
      } else {
        return container;
      }
    }
  }

  beforeEach(() => {
    Utils.guidCounter = 0

    this.bemContainer = bem("sk-refinement-list")
    this.bemOption = bem("sk-refinement-list-option")

    this.searchkit = SearchkitManager.mock()
    this.searchkit.translateFunction = (key) => {
      return {
        "test option 1": "test option 1 translated"
      }[key]
    }

    this.createWrapper(
      <RefinementListFilter
        field="test" id="test id" title="test title" size={3}
        searchkit={this.searchkit} />
    )

  });

  it('renders correctly', () => {

    let output = jsxToHTML(
      <div data-qa="filter--test id" className="sk-refinement-list filter--test id">
        <div data-qa="header" className="sk-refinement-list__header">test title</div>
        <div data-qa="options" className="sk-refinement-list__options">
          <div className="sk-refinement-list-option sk-refinement-list__item" data-qa="option">
            <input type="checkbox" data-qa="checkbox" readOnly={true} className="sk-refinement-list-option__checkbox"/>
            <div data-qa="label" className="sk-refinement-list-option__text">test option 1 translated</div>
            <div data-qa="count" className="sk-refinement-list-option__count">1</div>
          </div>
          <div className="sk-refinement-list-option sk-refinement-list__item" data-qa="option">
            <input type="checkbox" data-qa="checkbox" readOnly={true} className="sk-refinement-list-option__checkbox"/>
            <div data-qa="label" className="sk-refinement-list-option__text">test option 2</div>
            <div data-qa="count" className="sk-refinement-list-option__count">2</div>
          </div>
          <div className="sk-refinement-list-option sk-refinement-list__item" data-qa="option">
            <input type="checkbox" data-qa="checkbox" readOnly={true} className="sk-refinement-list-option__checkbox"/>
            <div data-qa="label" className="sk-refinement-list-option__text">test option 3</div>
            <div data-qa="count" className="sk-refinement-list-option__count">3</div>
          </div>
        </div>
        <div data-qa="show-more" className="sk-refinement-list__view-more-action">View all</div>
      </div>
    ).replace(/__checkbox"\/>/g, `__checkbox">`)
    // replacing cause jsdom html() not closing input tag

    expect(this.wrapper.html()).toEqual(output)

  });

  it('clicks options', () => {
    let option = this.getContainer("options", 0).children().at(0)
    let option2 = this.getContainer("options", 1).children().at(0)
    fastClick(option)
    fastClick(option2)
    expect(hasClass(option, "is-selected")).toBe(true)
    expect(hasClass(option2, "is-selected")).toBe(true)
    expect(this.accessor.state.getValue()).toEqual(['test option 1', 'test option 2'])
    fastClick(option2)
    this.wrapper.update()
    expect(this.accessor.state.getValue()).toEqual(['test option 1'])
  })

  it("show more options", () => {
    let option = {label:"view more", size:20}
    this.accessor.getMoreSizeOption = () => {return option}
    this.accessor.setViewMoreOption = sinon.spy()
    this.wrapper.update()
    expect(this.getContainer("view-more-action").text()).toBe("view more")
    fastClick(this.getContainer("view-more-action"))
    this.wrapper.update()
    expect(this.accessor.setViewMoreOption.calledOnce).toBe(true)
    expect(this.accessor.setViewMoreOption.calledWith(option)).toBe(true)
  })

  it("show no options", () => {
    this.accessor.getMoreSizeOption = () => {return null}
    this.wrapper.update()
    expect(this.getContainer("sk-view-more-action").length).toBe(0)
  })

  it("should configure accessor correctly", () => {
    expect(this.accessor.key).toBe("test")
    let options = this.accessor.options
    expect(options).toEqual({
      "id": "test id",
      "title": "test title",
      "size": 3,
      "facetsPerPage": 50,
      "operator": undefined,
      "translations": undefined,
      "orderKey":undefined,
      "orderDirection":undefined
    })
  })

  it("should work with a custom itemComponent", () => {
    this.createWrapper(
      <RefinementListFilter
        itemComponent = {({ label, count }) => <div className="option">{label} ({count})</div>}
        field="test" id="test id" title="test title"
        searchkit={this.searchkit} />
    )
    expect(this.getContainer("header").text()).toBe("test title")
    expect(this.getContainer("options").find(".option").map(e => e.text()))
      .toEqual(["test option 1 translated (1)", "test option 2 (2)", "test option 3 (3)"])

  })

  it("should work with a custom component", () => {
    this.createWrapper(
      <RefinementListFilter
        component={({ title, buckets }) => (
          <div>
            <div className="header">{title}</div>
            <div className="options">
              {buckets.map(({ key, doc_count }) => <div key={key} className="option">{key} ({doc_count})</div>) }
            </div>
          </div>
        )}
        field="test" id="test id" title="test title"
        searchkit={this.searchkit} />
    )
    expect(this.wrapper.find(".header").text()).toBe("test title")
    expect(this.wrapper.find(".option").map(e => e.text()))
      .toEqual(["test option 1 (1)", "test option 2 (2)", "test option 3 (3)"])

  })

});
