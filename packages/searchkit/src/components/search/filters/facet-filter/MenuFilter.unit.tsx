import * as React from "react";
import * as ReactDOM from "react-dom";
import {mount, render} from "enzyme";
import {fastClick} from "../../../__test__/TestHelpers"
import {SearchkitManager, Utils, ArrayState, FacetAccessor} from "../../../../core";
import {Toggle, ItemComponent, ItemList} from "../../../ui";
import {MenuFilter} from "./MenuFilter";

import * as _ from "lodash"
import * as sinon from "sinon";

describe("MenuFilter", ()=> {

  beforeEach(()=> {
    Utils.guidCounter = 0
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.wrapper = mount(
      <MenuFilter
        searchkit={this.searchkit}
        translations={{"Red":"Red Translated"}}
        field="color" title="Color" orderKey="_term" orderDirection="asc"
        include="title" exclude={["n/a"]}
        id="color" size={10}/>
    )
    this.getOptionAt = (at)=> {
      return this.wrapper.find(".sk-item-list")
        .children().at(at)
    }
    this.accessor = this.searchkit.getAccessorByType(FacetAccessor)
    this.searchkit.setResults({
      aggregations:{
        color1:{
          color:{
            buckets:[
              {key:"Red", doc_count:10},
              {key:"Blue", doc_count:11},
              {key:"Green", doc_count:12}
            ]
          },
          doc_count:33
        }
      }
    })
  })

  it("expect accessor options to be correct", ()=> {
    expect(this.wrapper.instance().props.listComponent).toBe(ItemList)
    expect(this.accessor.options).toEqual(jasmine.objectContaining({
      id:"color", field:"color", title:"Color", operator:"OR",
      translations:{"Red":"Red Translated"},
      size:10, facetsPerPage:50, orderKey:"_term",
      orderDirection:"asc", include:"title", exclude:["n/a"],
      "fieldOptions":{
        type:"embedded",
        field:"color"
      }
    }))
  })

  it("getSelectedItems", ()=> {
    this.accessor.state = new ArrayState([])
    expect(this.wrapper.instance().getSelectedItems())
      .toEqual(['$all'])
    this.accessor.state = new ArrayState([false])
    expect(this.wrapper.instance().getSelectedItems())
      .toEqual([false])
    this.accessor.state = new ArrayState(["foo", "bar"])
    expect(this.wrapper.instance().getSelectedItems())
      .toEqual(["foo"])
  })

  it("should render correctly", ()=> {
    expect(this.wrapper).toMatchSnapshot()    
  })

  it("should handle selection correctly", ()=> {
    this.wrapper = this.wrapper.update()
    let all = this.getOptionAt(0)
    let blue = this.getOptionAt(2)
    let green = this.getOptionAt(3)
    fastClick(blue)
    expect(this.accessor.state.getValue()).toEqual(["Blue"])
    fastClick(green)
    expect(this.accessor.state.getValue()).toEqual(["Green"])
    expect(this.searchkit.performSearch).toHaveBeenCalled()

    //should clear if button clicked
    fastClick(green)
    expect(this.accessor.state.getValue()).toEqual([])
    fastClick(blue)
    expect(this.accessor.state.getValue()).toEqual(["Blue"])
    fastClick(all)
    expect(this.accessor.state.getValue()).toEqual([])
    fastClick(all)
    expect(this.accessor.state.getValue()).toEqual([])

  })
})
