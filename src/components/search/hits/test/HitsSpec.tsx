import * as React from "react";
import {mount} from "enzyme";
import {Hits} from "../src/Hits";
import {SearchkitManager} from "../../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../__test__/TestHelpers"
import * as sinon from "sinon";

describe("Hits component", () => {

  describe('renders correctly', () => {

    beforeEach(() => {

      this.searchkit = SearchkitManager.mock()

      let customHighlight = { "fields": {} }
      this.wrapper = mount(
        <Hits searchkit={this.searchkit}
              hitsPerPage={10}
              highlightFields={["title"]}
              customHighlight={customHighlight}
              sourceFilter={["title"]}/>
      )

      this.pageSizeAccessor = this.searchkit.accessors.accessors[0]
      this.highlightAccessor = this.searchkit.accessors.accessors[1]
      this.customHighlightAccessor = this.searchkit.accessors.accessors[2]
      this.sourceFilterAccessor = this.searchkit.accessors.accessors[3]

      this.hasRendered = () => {
        return this.wrapper.find(".sk-hits").length == 1
      }

    });

    it("initalize accessors correctly", ()=> {
      expect(this.pageSizeAccessor.defaultSize).toBe(10)
      expect(this.customHighlightAccessor.highlightRequest).toEqual({ "fields": {} })
      expect(this.highlightAccessor.highlightFields)
        .toEqual({
           fields: { title:{}}
        })
      expect(this.sourceFilterAccessor.source).toEqual(["title"])
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
        <div data-qa="hits" className="sk-hits">
          <div data-qa="hit" className="sk-hits-hit sk-hits__item">1</div>
          <div data-qa="hit" className="sk-hits-hit sk-hits__item">2</div>
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
      expect(this.wrapper.find(".sk-hits__initial-loading").length).toBe(0)
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
        <div data-qa="hits" className="sk-hits">
          <div className="sk-hits-hit">1</div>
          <div className="sk-hits-hit">2</div>
        </div>
      ))
    })
  })

  describe("hits scrollTo", () => {

    beforeEach(() => {
      this.stub = sinon.stub(document, "querySelector")

      this.addHits = (scrollTo) => {
        this.searchkit = SearchkitManager.mock()

        this.wrapper = mount(
          <Hits searchkit={this.searchkit}
            scrollTo={scrollTo} hitsPerPage={10}/>
        )
      }

      this.setupTest = (selector) => {
        this.element = {
          scrollTop:100
        }
        this.stub.returns(this.element)

        this.addHits(selector)
        this.searchkit.setResults({
          hits:{
            hits:[{_id:1, title:1},{_id:2,title:2}],
            total:2
          }
        })
      }
    })

    afterEach(() => {
      this.stub.restore()
    })

    it("should scroll to body", () => {
      this.setupTest(true)

      expect(this.element.scrollTop).toBe(0)
      expect(this.stub.calledWith("body")).toBe(true)

    })

    it("should scroll to .element", () => {
      this.setupTest(".element")

      expect(this.element.scrollTop).toBe(0)
      expect(this.stub.calledWith(".element")).toBe(true)

    })

    it("no scroll", () => {
      this.setupTest(false)

      expect(this.stub.called).toBe(false)
      expect(this.element.scrollTop).toBe(100)

    })

    it("wont scroll on same results", () => {
      this.setupTest(true)

      expect(this.stub.callCount).toBe(1)
      this.searchkit.setResults({
        hits:{
          hits:[{_id:1, title:1},{_id:2,title:2}],
          total:2
        }
      })
      expect(this.stub.callCount).toBe(1)


    })

    it("will scroll on new results", () => {
      this.setupTest(true)

      expect(this.stub.callCount).toBe(1)
      this.searchkit.setResults({
        hits:{
          hits:[{_id:3, title:1},{_id:4,title:2}],
          total:2
        }
      })
      expect(this.stub.callCount).toBe(2)
      //should not scroll on rerender
      this.searchkit.emitter.trigger()
      expect(this.stub.callCount).toBe(2)

    })

    it("wont scroll on outside update", () => {
      this.setupTest(true)

      expect(this.stub.callCount).toBe(1)
      this.searchkit.setResults({
        hits: {
          hits: [{ _id: 3, title: 1 }, { _id: 4, title: 2 }],
          total: 2
        }
      })
      expect(this.stub.callCount).toBe(2)
      // Update with the same props
      this.wrapper.setProps({
        searchkit: this.seachkit,
        scrollTo: true,
        hitsPerPage: 10
      })
      expect(this.stub.callCount).toBe(2)
    })

  })

});
