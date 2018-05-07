import * as React from "react";
import {mount} from "enzyme";
import {HierarchicalMenuFilter} from "../src/HierarchicalMenuFilter";
import {fastClick} from "../../../../__test__/TestHelpers"
import { SearchkitManager, HierarchicalFacetAccessor} from "../../../../../core";
;
import * as sinon from "sinon";
import * as _ from "lodash"

describe("HierarchicalMenuFilter tests", () => {

  beforeEach(()=> {
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.mount = () => {
      this.wrapper = mount(
        <HierarchicalMenuFilter searchkit={this.searchkit}
          title="Categories" id="categories" orderKey="_term" orderDirection="asc"
          countFormatter={(count)=> "#"+count}
          fields={["lvl1", "lvl2"]}
        />
      )
    }
    this.mount()
    this.accessor = this.searchkit.getAccessorByType(HierarchicalFacetAccessor)
    this.setResults = ()=> {
      this.searchkit.setResults({
        aggregations:{
          categories:{
            lvl1:{ lvl1:{ buckets: [
              {key:"Red", doc_count:10},
              {key:"Green", doc_count:20}
            ]}},
            lvl2:{ lvl2: { buckets:[
              {key:"Crimson", doc_count:10},
              {key:"Maroon", doc_count:12}
            ] }}
          }
        }
      })
    }
  })

  it("should set the correct accessor options", ()=> {
    expect(this.accessor.key).toBe("categories")
    expect(this.accessor.options).toEqual({
      id: 'categories', title: 'Categories',
      fields: ['lvl1', 'lvl2'], size: 20,
      orderKey:"_term", orderDirection:"asc"
    })
  })

  it("should render first level correctly", ()=> {
    this.setResults()
    expect(this.wrapper).toMatchSnapshot()    
  })

  it("should render 2nd level correctly with selected 3rd level", ()=> {
    this.accessor.state = this.accessor.state.setValue([
      ["Red"], ["Maroon"]
    ])
    this.setResults()
    this.wrapper = this.wrapper.update()
    expect(this.wrapper).toMatchSnapshot()
  })

  it("should handle selecting an option", ()=> {
    this.setResults()
    this.wrapper = this.wrapper.update()
    let redOption = this.wrapper.find(".sk-hierarchical-menu-list__hierarchical-options")
      .children().at(0).find(".sk-hierarchical-menu-option")
    fastClick(redOption)
    expect(this.accessor.state.getValue()).toEqual([["Red"]])
  })

})
