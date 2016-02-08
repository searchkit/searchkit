import * as React from "react";
import {mount} from "enzyme";
import {Pagination} from "../src/Pagination.tsx";
import {SearchkitManager, ImmutableQuery} from "../../../../core";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../__test__/TestHelpers"
import * as sinon from "sinon";

describe("Pagination tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    this.searchkit.addDefaultQuery((query)=> {
      return query.setSize(10)
    })
    this.createWrapper = (showNumbers=true, pageScope=3) => {
      this.wrapper = mount(
        <Pagination searchkit={this.searchkit}
                    showNumbers={showNumbers}
                    pageScope={pageScope}
                    translations={{ "pagination.previous": "Previous Page" }} />
      );
      this.accessor = this.searchkit.accessors.statefulAccessors["p"]
    }

    this.searchkit.query = new ImmutableQuery().setSize(10)


    this.searchkit.setResults({
      hits:{
        total:80
      }
    })


  });

  describe("rendering", () => {

    beforeEach(() => {

      this.checkActionStates = (page, prevDisabled, nextDisabled, pages) => {
        this.accessor.state = this.accessor.state.setValue(page)
        this.wrapper.update()
        expect(this.wrapper.find(".pagination-navigation-item__prev")
          .hasClass("is-disabled")).toBe(prevDisabled)
        expect(this.wrapper.find(".pagination-navigation-item__next")
          .hasClass("is-disabled")).toBe(nextDisabled)
        const pageNumbers = this.wrapper.find(".pagination-navigation-item__number");
        expect(pageNumbers.map(e => e.text())).toEqual(pages);

        // Check links
        pageNumbers.forEach((e, idx) => {
          if (e.text() !== '...'){
            expect(e.html()).toContain('"/context.html?p=' + pages[idx] + '"')
          }
        })
      }
    })

    it("renders text", () => {
      this.createWrapper()
      expect(this.wrapper.find(".pagination-navigation-item__prev").text()).toBe("Previous Page")
      expect(this.wrapper.find(".pagination-navigation-item__next").text()).toBe("Next")
    })

    it('renders first page options', () => {
      this.createWrapper()
      this.checkActionStates(null,true, false, ['1', '2', '3', '4', '...'])
    })

    it('renders second page options', () => {
      this.createWrapper()
      this.checkActionStates(2, false, false, ['1', '2', '3', '4', '5', '...'])
    })

    it('renders eighth page options', () => {
      this.createWrapper()
      this.checkActionStates(8, false, true, ['1', '...', '5', '6', '7', '8'])
    })

    it("handles showNumbers prop", () => {
      this.createWrapper(false)
      this.checkActionStates(4, false, false, [])
    })

    it("handles pageScope prop", () => {
      this.createWrapper(true, 1)
      this.checkActionStates(4, false, false, ['1', '...', '3', '4', '5', '...'])
    })

    it("renders no pagination on no results", () => {
      this.searchkit.setResults({hits:{total:0}})
      this.createWrapper()
      expect(this.wrapper.find(".pagination-navigation").length).toBe(0)
    })

    it("both disabled on only one total page", () => {
      this.searchkit.setResults({ hits: { total: 10 } })
      this.createWrapper()
      expect(this.wrapper.find(".pagination-navigation").length).toBe(1)
      this.checkActionStates(1, true, true, ['1'])
    })

  });

  describe("interacting", () => {

    it("interact prev disabled", () => {
      this.createWrapper()
      this.accessor.state = this.accessor.state.setValue(1)

      fastClick(this.wrapper.find(".pagination-navigation-item__prev"))
      expect(this.accessor.state.getValue()).toBe(1)
    });

    it("click previous, next", ()=> {
      this.createWrapper()
      this.accessor.state = this.accessor.state.setValue(3)
      this.wrapper.update()
      fastClick(this.wrapper.find( ".pagination-navigation-item__prev" ))
      expect(this.accessor.state.getValue()).toBe(2)
      fastClick(this.wrapper.find( ".pagination-navigation-item__next" ))
      fastClick(this.wrapper.find( ".pagination-navigation-item__next" ))
      expect(this.accessor.state.getValue()).toBe(4)
    })

    it("ability to click last page", ()=> {
      this.createWrapper()
      this.accessor.state = this.accessor.state.setValue(7)
      this.wrapper.update()
      fastClick(this.wrapper.find( ".pagination-navigation-item__next" ))
      expect(this.accessor.state.getValue()).toBe(8)
      fastClick(this.wrapper.find( ".pagination-navigation-item__next" ))
      expect(this.accessor.state.getValue()).toBe(8)
    })


  })

});
