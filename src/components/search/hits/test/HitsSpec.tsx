import * as React from "react";
import {mount} from "enzyme";
import {Hits} from "../src/Hits";
import {SearchkitManager} from "../../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../__test__/TestHelpers"
import * as sinon from "sinon";

describe("Hits component", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()

    this.wrapper = mount(
      <Hits searchkit={this.searchkit} hitsPerPage={10} highlightFields={["title"]}/>
    )

    this.pageSizeAccessor = this.searchkit.accessors.accessors[0]
    this.hitsAccessor = this.searchkit.accessors.accessors[1]

  });

  it("initalize accessors correctly", ()=> {
    expect(this.pageSizeAccessor.size).toBe(10)
    expect(this.hitsAccessor.highlightFields)
      .toEqual({
         fields: { title:{}}
      })
  })


  describe('renders correctly', () => {

    beforeEach(() => {
      this.hasRendered = () => {
        return this.wrapper.find(".hits").length == 1
      }
    })

    it("does render", () => {
      this.searchkit.initialLoading = false
      this.searchkit.setResults({
        hits:{
          hits:[{_id:1, title:1},{_id:2,title:2}],
          total:2
        }
      })
      this.wrapper.update()
      expect(this.hasRendered()).toBeTruthy()
      expect(this.wrapper.html()).toEqual(jsxToHTML(
        <div data-qa="hits" className="hits">
          <div data-qa="hit" className="hits-hit hits__item"></div>
          <div data-qa="hit" className="hits-hit hits__item"></div>
        </div>
      ))
    })

    it("does not render on no hits", () => {
      this.searchkit.initialLoading = false
      this.searchkit.setResults({
        hits:{
          hits:[],
          total:0
        }
      })
      this.wrapper.update()
      expect(this.hasRendered()).toBeFalsy()
    })

    it("no longer renders initial view", () => {
      this.searchkit.initialLoading = true
      this.wrapper.update()
      expect(this.hasRendered()).toBeFalsy()
      expect(this.wrapper.find(".hits__initial-loading").length).toBe(0)
    })

    it("custom higher order component", ()=> {
      this.searchkit.setResults({
        hits:{
          hits:[{_id:1, title:1},{_id:2,title:2}],
          total:2
        }
      })
      let hit = (props)=> {
        return <div className={props.bemBlocks.item()}>{props.result.title}</div>
      }
      let wrapper = mount(
        <Hits searchkit={this.searchkit} itemComponent={hit} hitsPerPage={10}/>
      )
      expect(wrapper.html()).toEqual(jsxToHTML(
        <div data-qa="hits" className="hits">
          <div className="hits-hit">1</div>
          <div className="hits-hit">2</div>
        </div>
      ))
    })
  })

});
