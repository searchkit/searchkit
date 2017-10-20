import * as React from "react";
import {mount} from "enzyme";
import {Pagination, PaginationSelect} from "../src/Pagination";
import {SearchkitManager, ImmutableQuery} from "../../../../core";
import {Select} from "../../../ui";
import {
  fastClick, hasClass, printPrettyHtml
} from "../../../__test__/TestHelpers"
import * as sinon from "sinon";

describe("Pagination tests", () => {

  beforeEach(() => {

    this.searchkit = SearchkitManager.mock()
    this.searchkit.addDefaultQuery((query)=> {
      return query.setSize(10)
    })
    this.createWrapper = (showNumbers=true, pageScope=3, props={}) => {
      this.wrapper = mount(
        <Pagination searchkit={this.searchkit}
                    showNumbers={showNumbers}
                    pageScope={pageScope}
                    {...props}
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
        expect(this.wrapper.find(".sk-toggle__item").first()
          .hasClass("is-disabled")).toBe(prevDisabled)
        expect(this.wrapper.find(".sk-toggle__item").last()
          .hasClass("is-disabled")).toBe(nextDisabled)
        const pageNumbers = this.wrapper.find(".sk-toggle__item");
        const pageNumberTexts = pageNumbers.map(e => e.text())
        expect(pageNumberTexts).toEqual(pages);

      }
    })

    it("renders text", () => {
      this.createWrapper()
      expect(this.wrapper).toMatchSnapshot()
    })

    it("renders with pages", () => {
      this.createWrapper(false)
      expect(this.wrapper).toMatchSnapshot()
    })

    it('renders first page options', () => {
      this.createWrapper()
      this.checkActionStates(
        null,true,  false,
        ['Previous Page','1', '2', '3', '4', '...', 'Next']
      )
    })

    it('renders second page options', () => {
      this.createWrapper()
      this.checkActionStates(
        2, false, false,
        ['Previous Page', '1', '2', '3', '4', '5', '...', 'Next']
      )
    })

    it('renders eighth page options', () => {
      this.createWrapper()
      this.checkActionStates(
        8, false, true,
        ['Previous Page', '1', '...', '5', '6', '7', '8', 'Next']
      )
    })

    it("handles showNumbers prop", () => {
      this.createWrapper(false)
      this.checkActionStates(4, false, false, [
        'Previous Page', 'Next'
      ])
    })

    it("handles pageScope prop", () => {
      this.createWrapper(true, 1)
      this.checkActionStates(
        4, false, false,
        ['Previous Page', '1', '...', '3', '4', '5', '...', 'Next']
      )
    })

    it("renders no pagination on no results", () => {
      this.searchkit.setResults({hits:{total:0}})
      this.createWrapper()
      expect(this.wrapper.find(".sk-toggle").length).toBe(0)
    })

    it("both disabled on only one total page", () => {
      this.searchkit.setResults({ hits: { total: 10 } })
      this.createWrapper()
      this.checkActionStates(1, true, true, ['Previous Page','1', 'Next'])

    })

  });

  describe("interacting", () => {

    it("interact prev disabled", () => {
      this.createWrapper()
      this.accessor.state = this.accessor.state.setValue(1)

      fastClick(this.wrapper.find(".sk-toggle__item").first())
      expect(this.accessor.state.getValue()).toBe(1)
    });

    it("click previous, next", ()=> {
      this.createWrapper()
      this.accessor.state = this.accessor.state.setValue(3)
      this.wrapper.update()
      fastClick(this.wrapper.find(".sk-toggle__item").first())
      expect(this.accessor.state.getValue()).toBe(2)
      fastClick(this.wrapper.find(".sk-toggle__item").last())
      fastClick(this.wrapper.find(".sk-toggle__item").last())
      expect(this.accessor.state.getValue()).toBe(4)
    })

    it("ability to click last page", ()=> {
      this.createWrapper()
      this.accessor.state = this.accessor.state.setValue(7)
      this.wrapper.update()
      fastClick(this.wrapper.find(".sk-toggle__item").last())
      expect(this.accessor.state.getValue()).toBe(8)
      fastClick(this.wrapper.find(".sk-toggle__item").last())
      expect(this.accessor.state.getValue()).toBe(8)
    })

    it("dividers should not alter state", ()=> {
      this.createWrapper()
      this.accessor.state = this.accessor.state.setValue(2)
      this.wrapper.update()
      fastClick(this.wrapper.find("[data-key='ellipsis-6']"))
      //this was NaN before bug fix
      expect(this.accessor.state.getValue()).toBe(2)
    })

  })

  it("PaginationSelect", () => {
    this.wrapper = mount(
      <PaginationSelect searchkit={this.searchkit} />
    );
    this.wrapper.update()
    expect(this.wrapper).toMatchSnapshot()
  })

});
