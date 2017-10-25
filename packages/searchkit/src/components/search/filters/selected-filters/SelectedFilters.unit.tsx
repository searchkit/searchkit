import * as React from "react";
import {mount} from "enzyme";
import {SelectedFilters, FilterItemProps} from "./SelectedFilters";
import {SearchkitManager, ImmutableQuery, FastClick, block} from "../../../../core";

import * as _ from "lodash"
import * as sinon from "sinon";
import {
  fastClick, hasClass, printPrettyHtml, htmlClean
} from "../../../__test__/TestHelpers"

describe("SelectedFilters tests", () => {

  beforeEach(() => {

    this.bemContainer = block("sk-selected-filters").el
    this.bemOption = block("sk-selected-filters-option").el

    this.searchkit = SearchkitManager.mock()

    this.searchkit.translateFunction = (key)=> {
      return {
        "test name 2":"test name 2 translated",
        "test value 2": "test value 2 translated"
      }[key]
    }

    this.createWrapper = (props) => {

      this.wrapper = mount(
        <SelectedFilters searchkit={this.searchkit} {...props} />
      );

    }

    this.sinonSpy = sinon.spy();

    this.searchkit.query = new ImmutableQuery()
      .addSelectedFilter({
        id:"test",
        name:"test name",
        value:"test value",
        remove: this.sinonSpy
      }).addSelectedFilter({
        id:"test2",
        name:"test name 2",
        value:"test value 2",
        remove:_.identity
      })


  });

  it('renders correctly', () => {

    this.createWrapper()

    expect(this.wrapper).toMatchSnapshot()


  });

  it("handles remove click", () => {
    this.createWrapper()
    let elem = this.wrapper.find(".sk-selected-filters-option").at(0).find("."+this.bemOption("remove-action"))
    fastClick(elem)
    expect(this.sinonSpy.called).toBeTruthy()
  })

  it("overrides", () => {

    const FilterItem:React.StatelessComponent<FilterItemProps> = (props)=> (
      	<div className={props.bemBlocks.option()}>
    			<div className={props.bemBlocks.option("override-name")}>{props.labelValue}</div>
    			<FastClick handler={props.removeFilter}>
    				<div className={props.bemBlocks.option("remove-action")}>x</div>
    			</FastClick>
    		</div>
    )

    this.createWrapper({itemComponent:FilterItem})

    expect(this.wrapper).toMatchSnapshot()

    // click element to be removed

    let elem = this.wrapper.find(".sk-selected-filters-option").at(0).find("."+this.bemOption("remove-action"))
    fastClick(elem)
    expect(this.sinonSpy.called).toBeTruthy()

  })

  it("handles duplicate values", () => {

    this.searchkit.query = new ImmutableQuery()
      .addSelectedFilter({
        id:"test",
        name:"test name",
        value:"test value",
        remove: this.sinonSpy
      }).addSelectedFilter({
        id:"test2",
        name:"test name 2",
        value:"test value 2",
        remove:_.identity
      }).addSelectedFilter({
        id:"test2",
        name:"test name 2",
        value:"test value",
        remove:_.identity
      })

     this.createWrapper()

     let elems = this.wrapper.find(".sk-selected-filters-option")
     expect(elems.length).toEqual(3)
  })

});
