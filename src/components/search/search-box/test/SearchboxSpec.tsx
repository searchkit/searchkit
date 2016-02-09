import * as React from "react";
import {mount} from "enzyme";
import {SearchBox} from "../src/SearchBox.tsx";
import {SearchkitManager } from "../../../../core";
const bem = require("bem-cn");
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../__test__/TestHelpers"

import * as sinon from "sinon";

describe("Searchbox tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()

    this.searchkit.translateFunction = (key)=> {
      return {
        "searchbox.placeholder":"search movies",
      }[key]
    }

    this.createWrapper = (searchOnChange=false, queryFields=null, prefixQueryFields=null) => {
      this.wrapper = mount(
        <SearchBox searchkit={this.searchkit} searchOnChange={searchOnChange} queryFields={queryFields} prefixQueryFields={prefixQueryFields}/>
      );
      this.accessor = this.searchkit.accessors.getAccessors()[0]
    }

    this.typeSearch = (value)=> {
      this.wrapper.find(".sk-search-box__text")
        .simulate("input", {target:{value}})
    }

  });

  it("render", () => {
    this.createWrapper()
    expect(this.wrapper.find(".sk-search-box__text").get(0).placeholder).toBe("search movies")
  })

  it("search on change", () => {
    let spy = sinon.spy()
    this.searchkit.performSearch = spy
    this.createWrapper(true)
    this.typeSearch("m")
    expect(this.accessor.state.getValue()).toBe("m")
    expect(spy.callCount).toBe(1)
    this.typeSearch("ma")
    expect(this.accessor.state.getValue()).toBe("ma")
    expect(spy.callCount).toBe(1) // throttling should block it
    this.wrapper.node.throttledSearch.flush()
    expect(spy.callCount).toBe(2)
  })

  it("search on change with clock", ()=> {
    jasmine.clock().install()
    let queries = []
    this.searchkit.performSearch = ()=> {
      queries.push(this.searchkit.buildQuery())
    }
    expect(this.wrapper.node.props.searchThrottleTime).toBe(200)
    this.createWrapper(true)
    this.typeSearch("m")
    jasmine.clock().tick(100)
    expect(queries.length).toBe(1)
    expect(queries[0].getQueryString()).toBe("m")
    this.typeSearch("ma")
    jasmine.clock().tick(100)
    expect(queries.length).toBe(1)
    jasmine.clock().tick(300)
    expect(queries.length).toBe(2)
    expect(queries[1].getQueryString()).toBe("ma")
    jasmine.clock().uninstall()
  })

  it("search on submit", () => {
    let spy = sinon.spy()
    this.searchkit.performSearch = spy

    this.createWrapper(false)
    this.typeSearch('m')
    this.typeSearch('ma')
    expect(this.accessor.state.getValue()).toBe("ma")
    expect(spy.callCount).toBe(0)
    this.wrapper.find("form").simulate("submit")
    expect(spy.callCount).toBe(1)
  })

  it("should configure accessor defaults correctly", ()=> {
    this.createWrapper(false, ["title"])

    expect(this.accessor.key).toBe("q")
    let options = this.accessor.options
    expect(options).toEqual({
      "queryFields": ["title"],
      prefixQueryFields:false,
      "queryOptions": {}
    })

  })

  it("should configure accessor search on change correctly", ()=> {
    this.createWrapper(true, ["title"])

    expect(this.accessor.key).toBe("q")
    let options = this.accessor.options
    expect(options).toEqual({
      "queryFields": ["title"],
      prefixQueryFields:["title"],
      "queryOptions": {}
    })

  })

  it("should configure accessor + prefix", ()=> {
    this.createWrapper(true, ["title"], ["prefix"])

    expect(this.accessor.key).toBe("q")
    let options = this.accessor.options
    expect(options).toEqual({
      "queryFields": ["title"],
      prefixQueryFields:["prefix"],
      "queryOptions": {}
    })

  })

  it("should handle focus", ()=> {
    this.createWrapper(true, ["title"], ["prefix"])
    expect(
      this.wrapper.find(".sk-search-box")
        .hasClass("is-focused")
    ).toBe(false)
    expect(this.wrapper.node.state)
      .toEqual({ focused:false })
    this.wrapper.find(".sk-search-box__text")
      .simulate("focus")
    expect(this.wrapper.node.state)
      .toEqual({ focused:true })
    this.wrapper.update()
    expect(
      this.wrapper.find(".sk-search-box")
        .hasClass("is-focused")
    ).toBe(true)

  })


});
