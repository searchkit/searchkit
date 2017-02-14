import * as React from "react";
import {mount} from "enzyme";
import {SearchBox} from "./SearchBox";
import {SearchkitManager, QueryString } from "../../../core";
const bem = require("bem-cn");
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../__test__/TestHelpers"
import {
  throttle
} from 'lodash'


import {omit} from "lodash"

describe("Searchbox tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.searchkit.translateFunction = (key)=> {
      return {
        "searchbox.placeholder":"search movies",
      }[key]
    }

    this.createWrapper = (searchOnChange=false, queryFields=null, prefixQueryFields=null, options={}) => {
      this.wrapper = mount(
        <SearchBox searchkit={this.searchkit}
          searchOnChange={searchOnChange}
          queryFields={queryFields} prefixQueryFields={prefixQueryFields}
          queryOptions={{minimum_should_match:"60%"}}
          prefixQueryOptions={{minimum_should_match:"70%"}}
          {...options}
        />
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
    this.createWrapper(true)
    this.typeSearch("m")
    expect(this.accessor.state.getValue()).toBe("m")
    expect(this.searchkit.performSearch.calls.count()).toEqual(1)
    this.typeSearch("ma")
    expect(this.accessor.state.getValue()).toBe("ma")
    expect(this.searchkit.performSearch.calls.count()).toEqual(1)
    this.wrapper.node.throttledSearch.flush()
    expect(this.searchkit.performSearch.calls.count()).toEqual(2)
  })

  describe("search on change with clock", () => {

    it("clock", ()=> {
      let queries = []
      this.searchkit.performSearch = ()=> {
        queries.push(this.searchkit.buildQuery())
      }
      this.createWrapper(true)
      expect(this.wrapper.node.props.searchThrottleTime).toBe(200)
      this.typeSearch("m")
      this.wrapper.node.throttledSearch.flush()
      expect(queries.length).toBe(1)
      expect(queries[0].getQueryString()).toBe("m")
      this.typeSearch("ma")
      expect(queries.length).toBe(1)
      this.wrapper.node.throttledSearch.flush()
      expect(queries.length).toBe(2)
      expect(queries[1].getQueryString()).toBe("ma")
    })

  })

  it("search on submit", () => {
    this.createWrapper(false)
    this.typeSearch('m')
    this.typeSearch('ma')
    expect(this.accessor.state.getValue()).toBe(null)
    expect(this.searchkit.performSearch.calls.count()).toEqual(0)
    this.wrapper.find("form").simulate("submit")
    expect(this.accessor.state.getValue()).toBe("ma")
    expect(this.searchkit.performSearch.calls.count()).toEqual(1)
  })

  it("should configure accessor defaults correctly", ()=> {
    this.createWrapper(false, ["title"])

    expect(this.accessor.key).toBe("q")
    let options = this.accessor.options
    expect(omit(options, "onQueryStateChange")).toEqual({
      queryFields: ["title"],
      prefixQueryFields:null,
      queryOptions: {minimum_should_match:"60%"},
      prefixQueryOptions: {minimum_should_match:"70%"},
      queryBuilder:undefined
    })

  })

  it("should configure accessor search on change correctly", ()=> {
    this.createWrapper(true, ["title"])

    expect(this.accessor.key).toBe("q")
    let options = this.accessor.options
    expect(options).toEqual({
      queryFields: ["title"],
      prefixQueryFields:null,
      queryOptions: {minimum_should_match:"60%"},
      prefixQueryOptions: {minimum_should_match:"70%"},
      queryBuilder:undefined,
      onQueryStateChange:jasmine.any(Function)
    })

  })

  it("should configure accessor + prefix", ()=> {
    this.createWrapper(true, ["title"], ["prefix"], {queryBuilder:QueryString})

    expect(this.accessor.key).toBe("q")
    let options = this.accessor.options
    expect(options).toEqual({
      queryFields: ["title"],
      prefixQueryFields:["prefix"],
      queryOptions: {minimum_should_match:"60%"},
      prefixQueryOptions: {minimum_should_match:"70%"},
      queryBuilder:QueryString,
      onQueryStateChange:jasmine.any(Function)
    })

  })

  it("should handle focus", ()=> {
    this.createWrapper(true, ["title"], ["prefix"])
    expect(
      this.wrapper.find(".sk-search-box")
        .hasClass("is-focused")
    ).toBe(false)
    expect(this.wrapper.node.state)
      .toEqual({ focused:false, input: undefined })
    this.wrapper.find(".sk-search-box__text")
      .simulate("focus")
    expect(this.wrapper.node.state)
      .toEqual({ focused:true, input: undefined })
    this.wrapper.update()
    expect(
      this.wrapper.find(".sk-search-box")
        .hasClass("is-focused")
    ).toBe(true)

  })


  describe("url change + blurAction", ()=> {

    it("blurAction:restore", ()=> {
      this.createWrapper(false, ["title"], ["prefix"], {
        blurAction:"restore"
      })
      this.typeSearch("la")
      expect(this.wrapper.node.getValue() ).toEqual("la")
      this.accessor.fromQueryObject({
        q:"foo"
      })
      expect(this.wrapper.node.getValue() ).toEqual("foo")

      this.typeSearch("bar")
      expect(this.wrapper.node.getValue()).toEqual("bar")
      this.wrapper.find(".sk-search-box__text")
        .simulate("blur")

      // should be restored to previous value
      expect(this.wrapper.node.getValue()).toEqual("foo")
      expect(this.searchkit.performSearch).not.toHaveBeenCalled()

    })

    it("blurAction:search", ()=> {
      this.createWrapper(false, ["title"], ["prefix"], {
        blurAction:"search"
      })
      this.typeSearch("la")
      expect(this.wrapper.node.getValue() ).toEqual("la")
      this.accessor.fromQueryObject({
        q:"foo"
      })
      expect(this.wrapper.node.getValue() ).toEqual("foo")

      this.typeSearch("bar")
      expect(this.wrapper.node.getValue()).toEqual("bar")
      this.wrapper.find(".sk-search-box__text")
        .simulate("blur")

      // should flush value + search
      expect(this.wrapper.node.getValue()).toEqual("bar")
      expect(this.searchkit.performSearch).toHaveBeenCalled()

    })

  })

});
