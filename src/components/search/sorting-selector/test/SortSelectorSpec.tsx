import * as React from "react";
import {mount} from "enzyme";
import {SortingSelector} from "../src/SortingSelector";
import {SearchkitManager, SortingAccessor } from "../../../../core";
import {Toggle} from "../../../ui";

import * as sinon from "sinon";
import * as _ from "lodash"
import {
  expectWrapperSnaphot
} from "../../../__test__/TestHelpers"

describe("SortingSelector tests", () => {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.setWrapper = () => {
      this.wrapper = mount(
        <SortingSelector searchkit={this.searchkit} options={[
          {label:"Relevance"},
          {label:"Latest Releases", field:"released", order:"desc"},
          {label:"Earliest Releases", field:"released", order:"asc", key:"earliest"}
        ]} translations={{"Relevance":"Relevance translated"}}/>
      )
    }
    this.setWrapper()
    this.accessor = this.searchkit.getAccessorByType(SortingAccessor)
    this.setResults = ()=> {
      this.searchkit.setResults({
        hits:{
          hits:[1,2],
          total:2
        }
      })
    }
  })

  it("is disabled when no results", ()=> {
    expect(this.wrapper.children().length).toBe(1)
    expect(this.wrapper.html()).toMatchSnapshot()
  })

  it("renders with results", ()=> {
    this.setResults()
    expect(this.wrapper.children().length).toBe(1)
    expect(this.wrapper.html()).toMatchSnapshot()

  })

  it("renders with selected value", ()=> {
    this.accessor.state = this.accessor.state.setValue("released_desc")
    this.setResults()
    this.setWrapper()

    expect(this.wrapper.html()).toMatchSnapshot()

  })

  it("renders with defaultOption", ()=> {
    this.accessor.options.options[2].defaultOption = true
    this.setResults()
    this.setWrapper()
    expect(this.wrapper.html()).toMatchSnapshot()

  })

  it("select new sort option", ()=> {
    this.accessor.state = this.accessor.state.setValue("released_desc")
    this.setResults()
    let earlyOption = this.wrapper.find("select").children().at(2)
    earlyOption.simulate("change")
    expect(this.accessor.state.getValue()).toBe("earliest")
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

  it("handle prop reload without breaking computed keys", ()=> {
    this.wrapper.setProps({options:[
      {label:"Relevance"},
      {label:"Latest Releases", field:"released", order:"desc"},
      {label:"Earliest Releases", field:"released", order:"asc", key:"earliest"}
    ]})
    this.setResults()
    expect(this.wrapper.html()).toMatchSnapshot()

  })

  it("custom mod, className, listComponent", ()=> {
    this.wrapper = mount(
      <SortingSelector searchkit={this.searchkit}
        mod="my-select" className="custom-class" listComponent={Toggle} options={[
        {label:"Relevance"},
        {label:"Latest Releases", field:"released", order:"desc"},
        {label:"Earliest Releases", field:"released", order:"asc", key:"earliest"}
      ]}/>
    )
    expect(this.wrapper.html()).toMatchSnapshot()


  })

})
