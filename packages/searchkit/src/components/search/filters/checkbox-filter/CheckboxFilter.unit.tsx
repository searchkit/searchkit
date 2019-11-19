import * as React from "react";;
import {mount, render} from "enzyme";
import { fastClick} from "../../../__test__/TestHelpers"
import {CheckboxFilter} from "./CheckboxFilter";
import {SearchkitManager, Utils} from "../../../../core";
import {Toggle, ItemComponent} from "../../../ui";
import { TermQuery, CheckboxFilterAccessor } from "../../../../core";

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

    this.accessor = this.searchkit.getAccessorByType(CheckboxFilterAccessor)
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
    expect(this.wrapper).toMatchSnapshot()
  });

  it('clicks options', () => {
    expect(this.accessor.state.getValue()).toEqual(null)
    let option = this.wrapper.find(".sk-item-list").children().at(0)
    expect(this.wrapper).toMatchSnapshot("option is not active")
    fastClick(option)
    expect(this.wrapper).toMatchSnapshot("option is active")
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
    expect(this.wrapper).toMatchSnapshot("panel is not disabled")

    this.searchkit.setResults({
      hits:{ total:0 },
      aggregations: {
        "test id1": {
          doc_count: 50
        }
      }
    })
    expect(this.wrapper).toMatchSnapshot("panel is disabled")

    expect(this.accessor.state.getValue()).toEqual(null)
    let option = this.wrapper.find(".sk-item-list").children().at(0)
    fastClick(option)
    expect(this.accessor.state.getValue()).toEqual(true)

    expect(this.wrapper).toMatchSnapshot("panel is not disabled again")

  })
});
