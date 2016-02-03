import * as React from "react";
import {mount} from "enzyme";
import {SelectedFilters, FilterItemProps} from "../src/SelectedFilters.tsx";
import {SearchkitManager, ImmutableQuery, FastClick} from "../../../../../core";
const bem = require("bem-cn");
const _ = require("lodash")
import * as sinon from "sinon";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../../__test__/TestHelpers"

describe("SelectedFilters tests", () => {

  beforeEach(() => {

    this.bemContainer = bem("selected-filters")
    this.bemOption = bem("selected-filters-option")

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

    expect(this.wrapper.html()).toEqual(jsxToHTML(
<div className="selected-filters">
  <div className="selected-filters-option selected-filters__item selected-filter--test">
    <div className="selected-filters-option__name"><span>test name</span><span>: </span><span>test value</span></div>
    <div className="selected-filters-option__remove-action">x</div>
  </div>
  <div className="selected-filters-option selected-filters__item selected-filter--test2">
    <div className="selected-filters-option__name"><span>test name 2 translated</span><span>: </span><span>test value 2 translated</span></div>
    <div className="selected-filters-option__remove-action">x</div>
  </div>
</div>
    ))


  });

  it("handles remove click", () => {
    this.createWrapper()
    let elem = this.wrapper.find(".selected-filters-option").at(0).find("."+this.bemOption("remove-action"))
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

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="selected-filters">
        <div className="selected-filters-option">
          <div className="selected-filters-option__override-name">test value</div>
          <div className="selected-filters-option__remove-action">x</div>
        </div>
        <div className="selected-filters-option">
          <div className="selected-filters-option__override-name">test value 2 translated</div>
          <div className="selected-filters-option__remove-action">x</div>
        </div>
      </div>
    ))

    // click element to be removed

    let elem = this.wrapper.find(".selected-filters-option").at(0).find("."+this.bemOption("remove-action"))
    fastClick(elem)
    expect(this.sinonSpy.called).toBeTruthy()

  })

});
