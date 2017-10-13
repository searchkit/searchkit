import * as React from "react"
import {mount, render} from "enzyme";
import {fastClick, hasClass, printPrettyHtml, htmlClean} from "../../../__test__/TestHelpers"
import { TagFilter, TagFilterConfig } from "./";
import {SearchkitManager, Utils, FacetAccessor} from "../../../../core";

;
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

    this.accessor = this.searchkit.getAccessorByType(FacetAccessor)
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
        <TagFilterConfig field="test" id="testId" title="test title" operator="OR" searchkit={this.searchkit} />
        <TagFilter field="testId" value="test option 1" searchkit={this.searchkit} />
        <TagFilter field="testId" value="test option 2" searchkit={this.searchkit} />
      </div>
    )

    expect(this.wrapper).toMatchSnapshot()
  });

  it('renders with custom children', () => {

    this.createWrapper(
      <div>
        <TagFilterConfig field="test" id="testId" title="test title" operator="OR" searchkit={this.searchkit} />
        <TagFilter field="testId" value="test option 1" searchkit={this.searchkit} >
          <div className="custom-element">test option</div>
        </TagFilter>
      </div>
    )

    expect(this.wrapper).toMatchSnapshot()
  })

  it('handles click', () => {

    this.createWrapper(
      <div>
        <TagFilterConfig field="test" id="testId" title="test title" operator="OR" searchkit={this.searchkit} />
        <TagFilter field="testId" value="test option 1" searchkit={this.searchkit} />
        <TagFilter field="testId" value="test option 2" searchkit={this.searchkit} />
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

  it("test console warning for missing accessor", ()=> {
    spyOn(console, "warn")
    spyOn(console, "error")
    this.createWrapper(
      <div>
        <TagFilter field="testId" value="test option 1" searchkit={this.searchkit} />        
      </div>
    )
    expect(console.warn).toHaveBeenCalledWith(
      'Missing accessor for', 'testId', 'in TagFilter, add TagFilterConfig if needed')
    expect(console.error).not.toHaveBeenCalled()

    fastClick(this.wrapper.find(".sk-tag-filter").at(0))
    
    expect(console.error).toHaveBeenCalledWith(
      'Missing accessor for', 'testId', 'in TagFilter, add TagFilterConfig if needed')
  })
});
