import * as React from "react";;
import {mount, render} from "enzyme";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../__test__/TestHelpers"
import {CheckboxFilter} from "./CheckboxFilter";
import {SearchkitManager, Utils} from "../../../../core";
import {Toggle, ItemComponent} from "../../../ui";
import { TermQuery } from "../../../../core";

const bem = require("bem-cn");
import * as _ from "lodash"
import * as sinon from "sinon";

describe("CheckboxFilter tests", () => {
  this.createWrapper = (component) => {
    this.wrapper = mount(component)

    this.searchkit.setResults({
      hits:{
        hits:[{_id:1, title:1},{_id:2,title:2}],
        total:2
      },
      aggregations: {
        "test id1": {
          doc_count: 50
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
      <CheckboxFilter
        id="test id" title="test title" label="test label"
        searchkit={this.searchkit}
        filter={TermQuery("test-field", "test-value")} />
    )
  });

  it('renders correctly', () => {
    let output = jsxToHTML(
      <div className="sk-panel filter--test id">
        <div className="sk-panel__header">test title</div>
        <div className="sk-panel__content">
          <div data-qa="options" className="sk-item-list">
            <div className="sk-item-list-option sk-item-list__item" data-qa="option" data-key="test label">
              <input type="checkbox" data-qa="checkbox" readOnly={true} className="sk-item-list-option__checkbox" value="on"/>
              <div data-qa="label" className="sk-item-list-option__text">test label</div>
              <div data-qa="count" className="sk-item-list-option__count">50</div>
            </div>
          </div>
        </div>
      </div>
    )

    expect(this.wrapper.html()).toEqual(output)

  });

  it('clicks options', () => {
    expect(this.accessor.state.getValue()).toEqual(null)
    let option = this.wrapper.find(".sk-item-list").children().at(0)
    fastClick(option)
    expect(hasClass(option, "is-active")).toBe(true)
    expect(this.accessor.state.getValue()).toEqual(true)
    fastClick(option)
    expect(this.accessor.state.getValue()).toEqual(false) // Back to null ?
  })

  it("should configure accessor correctly", () => {
    expect(this.accessor.key).toBe("test id")
    let options = this.accessor.options

    expect(options).toEqual({
      "id": "test id",
      "title": "test title",
      "label": "test label",
      "translations": undefined,
      "filter": TermQuery("test-field", "test-value")
    })
  })

  it("can disable", () => {
    expect(hasClass(this.wrapper.find(".sk-panel"), "is-disabled")).toBe(false)
    this.searchkit.setResults({
      hits:{ total:0 },
      aggregations: {
        "test id1": {
          doc_count: 50
        }
      }
    })
    expect(hasClass(this.wrapper.find(".sk-panel"), "is-disabled")).toBe(true)

    expect(this.accessor.state.getValue()).toEqual(null)
    let option = this.wrapper.find(".sk-item-list").children().at(0)
    fastClick(option)
    expect(this.accessor.state.getValue()).toEqual(true)

    expect(hasClass(this.wrapper.find(".sk-panel"), "is-disabled")).toBe(false)
  })
});
