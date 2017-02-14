import * as React from "react"
import {mount, render} from "enzyme";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml, htmlClean} from "../../../__test__/TestHelpers"
import { TagFilter, TagFilterConfig } from "./";
import {SearchkitManager, Utils} from "../../../../core";

const bem = require("bem-cn");
import * as _ from "lodash"
import * as sinon from "sinon";

describe("TagFilter tests", () => {
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
  });

  it('renders correctly', () => {

    this.createWrapper(
      <div>
        <TagFilterConfig field="test" id="test id" title="test title" operator="OR" searchkit={this.searchkit} />
        <TagFilter field="test" value="test option 1" searchkit={this.searchkit} />
        <TagFilter field="test" value="test option 2" searchkit={this.searchkit} />
      </div>
    )

    let output = jsxToHTML(
      <div>
        <div className="sk-tag-filter">test option 1</div>
        <div className="sk-tag-filter">test option 2</div>
      </div>
    )
    expect(htmlClean(this.wrapper.html())).toEqual(output)
  });

  it('renders with custom children', () => {

    this.createWrapper(
      <div>
        <TagFilterConfig field="test" id="test id" title="test title" operator="OR" searchkit={this.searchkit} />
        <TagFilter field="test" value="test option 1" searchkit={this.searchkit} >
          <div className="custom-element">test option</div>
        </TagFilter>
      </div>
    )

    let output = jsxToHTML(
      <div>
        <div className="sk-tag-filter">
          <div className="custom-element">test option</div>
        </div>
      </div>
    )
    expect(htmlClean(this.wrapper.html())).toEqual(output)
  })

  it('handles click', () => {

    this.createWrapper(
      <div>
        <TagFilterConfig field="test" id="test id" title="test title" operator="OR" searchkit={this.searchkit} />
        <TagFilter field="test" value="test option 1" searchkit={this.searchkit} />
        <TagFilter field="test" value="test option 2" searchkit={this.searchkit} />
      </div>
    )

    let option = this.wrapper.find(".sk-tag-filter").at(0)
    let option2 = this.wrapper.find(".sk-tag-filter").at(1)
    fastClick(option)
    expect(hasClass(option, "is-active")).toBe(true)
    expect(hasClass(option2, "is-active")).toBe(false)
    expect(this.accessor.state.getValue()).toEqual(['test option 1'])
    fastClick(option2)
    expect(hasClass(option, "is-active")).toBe(true)
    expect(hasClass(option2, "is-active")).toBe(true)
    fastClick(option)
    expect(hasClass(option, "is-active")).toBe(false)
    fastClick(option2)
    expect(this.accessor.state.getValue()).toEqual([])
  })
});
