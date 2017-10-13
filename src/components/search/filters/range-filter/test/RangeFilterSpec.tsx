import * as React from "react";
import {mount} from "enzyme";
import {RangeFilter} from "../src/RangeFilter";
import { RangeSliderHistogram, RangeInput } from "../../../../../components"
import {SearchkitManager, RangeAccessor} from "../../../../../core";
import {
  fastClick, hasClass, printPrettyHtml
} from "../../../../__test__/TestHelpers"


import * as sinon from "sinon";

describe("Range Filter tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, "performSearch")
    this.rangeFormatter = (count) => count + " score"
    this.createWrapper = ({
      withHistogram=true, 
      interval=undefined, 
      rangeComponent=RangeSliderHistogram
    }) => {

      
      this.wrapper = mount(
        <RangeFilter
          id="m"
          searchkit={this.searchkit}
          field="metascore"
          min={0}
          max={100}
          title="metascore"
          interval={interval}
          translations={{"range.divider":" to "}}
          rangeFormatter={this.rangeFormatter}
          rangeComponent={rangeComponent}
          showHistogram={withHistogram}/>
      );


      this.searchkit.setResults({
        "aggregations": {
          "m1": {
            "m": {
              "buckets": [
                { key: "10", doc_count: 1 },
                { key: "20", doc_count: 3 },
                { key: "30", doc_count: 1 },
                { key: "40", doc_count: 1 },
                { key: "50", doc_count: 1 },
                { key: "60", doc_count: 5 },
                { key: "70", doc_count: 1 },
                { key: "80", doc_count: 1 },
                { key: "90", doc_count: 1 },
                { key: "100", doc_count: 1 }
              ],
              "value":10
            }
          }
        }
      })


     

      this.wrapper.update()
      this.accessor = this.searchkit.getAccessorByType(RangeAccessor)
    }


  });


  it("accessor has correct config", () => {
    this.createWrapper({withHistogram:true})
    expect(this.accessor.options).toEqual({
      id:"m",
      min:0,
      max:100,
      field:"metascore",
      title:"metascore",
      interval: undefined,
      loadHistogram:true,
      fieldOptions:{
        type:'embedded',
        field:'metascore'
      },
      rangeFormatter:this.rangeFormatter,
      translations:{"range.divider": " to "}
    })
  })

  it('renders correctly', () => {
    this.createWrapper({withHistogram:true})    
    expect(this.wrapper).toMatchSnapshot()
  })

  it("renders without histogram", () => {
    this.createWrapper({withHistogram:false})
    expect(this.wrapper.find(".sk-range-histogram").length).toBe(0)
    expect(this.wrapper.find(".sk-range-histogram__bar").length).toBe(0)
    expect(this.wrapper).toMatchSnapshot()
  })

  it("handle slider events correctly", ()=> {
    this.createWrapper(true)
    this.wrapper.node.sliderUpdate({min:30,max:70})
    expect(this.accessor.state.getValue()).toEqual({
      min:30, max:70
    })
    expect(this.searchkit.performSearch).not.toHaveBeenCalled()

    this.wrapper.node.sliderUpdateAndSearch({min:40,max:60})
    expect(this.accessor.state.getValue()).toEqual({
      min:40, max:60
    })
    expect(this.searchkit.performSearch).toHaveBeenCalled()
    let query = this.searchkit.buildQuery()
    expect(query.getSelectedFilters()[0].value).toEqual('40 score to 60 score')
    expect(this.wrapper).toMatchSnapshot()

    // min/max should clear
    this.wrapper.node.sliderUpdateAndSearch({min:0,max:100})
    expect(this.accessor.state.getValue()).toEqual({})
    expect(this.wrapper).toMatchSnapshot()

  })

  it("has default interval", ()=> {
    this.createWrapper({withHistogram:true})
    expect(this.accessor.getInterval()).toEqual(5)
  })

  it("handles interval correctly", ()=> {
    this.createWrapper({ withHistogram: true, interval:2 })
    expect(this.accessor.getInterval()).toEqual(2)
  })

  it("renders limited range correctly", ()=> {
    this.createWrapper({ withHistogram: true })

    this.wrapper.node.sliderUpdate({min:30,max:70})
    expect(this.wrapper).toMatchSnapshot()
  })

  it("renders with range input component", ()=> {
    this.createWrapper({ withHistogram: false, rangeComponent:RangeInput })
    expect(this.wrapper).toMatchSnapshot()       
    
    this.wrapper.find("input[placeholder='min']")
      .simulate('change', {target:{value:20}})    
    this.wrapper.find("input[placeholder='max']")
      .simulate('change', { target: { value: 80 } })    
    this.wrapper.find("form").simulate('submit')
    let query = this.searchkit.buildQuery()
    expect(query.getSelectedFilters()[0].value)
      .toEqual("20 score to 80 score")
    
    

  })

});
