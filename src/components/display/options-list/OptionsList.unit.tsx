import * as React from "react";
import {mount} from "enzyme";
import {OptionsList} from "./OptionsList";
import {Toggle} from "../../ui";

import {
  SearchkitManager, StatefulAccessor, ValueState
} from "../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../__test__/TestHelpers"

const map = require("lodash/map")

class ExampleAccessor extends StatefulAccessor<ValueState> {
  options:Object
  state = new ValueState()
  constructor(key, options){
    super(key)
    this.options = options

  }
}

describe("OptionsList component", () => {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    this.exampleAccessor = new ExampleAccessor( "example", {} )
    this.searchkit.addAccessor(this.exampleAccessor)
    this.searchkit.initialLoading = false
    this.searchkit.setResults({
      hits:{
        hits:[{_id:1, title:1},{_id:2,title:2}],
        total:2
      }
    })

    this.wrapper = mount(
      <OptionsList
        searchkit={this.searchkit}
        id="options"
        accessorId="example"
        accessorProp="someProp"
        options={[
          {label:"A", key:"a", value:2},
          {label:"B", key:"b", value:4, defaultOption:true},
          {label:"C", key:"c", value:6}
        ]}
      />
    )
  })

  it("should render correctly", ()=> {
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-select">
        <select defaultValue="b">
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
        </select>
      </div>
    ))
    this.searchkit.performSearch()
    expect(this.exampleAccessor.options)
      .toEqual({ someProp:4 })

  })

  it("select option", ()=> {
    this.wrapper.find("option").at(2).simulate("change")
    expect(this.exampleAccessor.options)
      .toEqual({ someProp:6 })
  })

  it("supports custom props", ()=> {
    this.wrapper.setProps({
      mod:"foo", className:"someClass",
      listComponent:Toggle,
      translations:{
        "A":"A translated"
      }
    })

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div data-qa="options" className="foo someClass">
        <div className="foo-option foo__item" data-qa="option" data-key="a">
          <div data-qa="label" className="foo-option__text">A translated</div>
        </div>
        <div className="foo-option foo__item is-active" data-qa="option" data-key="b">
          <div data-qa="label" className="foo-option__text">B</div>
        </div>
        <div className="foo-option foo__item" data-qa="option" data-key="c">
          <div data-qa="label" className="foo-option__text">C</div>
        </div>
      </div>
    ))

  })
})
