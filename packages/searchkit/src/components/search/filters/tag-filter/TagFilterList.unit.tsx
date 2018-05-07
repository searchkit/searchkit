import * as React from "react"
import {mount} from "enzyme";
import {fastClick} from "../../../__test__/TestHelpers"
import { TagFilterList, TagFilterConfig } from "./"
import { SearchkitManager, Utils, FacetAccessor} from "../../../../core"
import * as _ from "lodash"
import * as sinon from "sinon"

describe("TagFilterList tests", () => {
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

    this.createWrapper(
      <div>
        <TagFilterConfig field="test" id="testId" title="test title" operator="OR" searchkit={this.searchkit} />
        <TagFilterList field="testId" values={["test option 1", "test option 2"]} searchkit={this.searchkit} />
      </div>
    )
  });

  it('renders correctly', () => {
    expect(this.wrapper).toMatchSnapshot()
  });

  it('handles click', () => {
    let option = this.wrapper.find(".sk-tag-filter").at(0)
    let option2 = this.wrapper.find(".sk-tag-filter").at(1)
    fastClick(option)
    expect(this.wrapper).toMatchSnapshot("option 1 active, option 2 not active");
    expect(this.accessor.state.getValue()).toEqual(['test option 1'])
    fastClick(option2)
    expect(this.wrapper).toMatchSnapshot("option 1 active, option 2 active");
    fastClick(option)
    expect(this.wrapper).toMatchSnapshot("option 1 not active, option 2 active");
    fastClick(option2)
    expect(this.accessor.state.getValue()).toEqual([])
  })
});
