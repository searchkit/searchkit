import * as React from "react";
import {mount} from "enzyme";
import {Pagination} from "../src/Pagination.tsx";
import {SearchkitManager, ImmutableQuery} from "../../../../core";

import * as sinon from "sinon";

describe("Pagination tests", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:true})

    this.createWrapper = () => {
      this.wrapper = mount(
        <Pagination searchkit={this.searchkit} translations={{"pagination.previous":"Previous Page"}} />
      );
      this.accessor = this.searchkit.accessors.getAccessors()[0]
    }

    this.searchkit.query = new ImmutableQuery().setSize(10)


    this.searchkit.setResults({
      hits:{
        total:40
      }
    })


  });

  describe("rendering", () => {

    beforeEach(() => {

      this.checkActionStates = (page, prevDisabled, nextDisabled) => {
        this.createWrapper()
        this.accessor.state = this.accessor.state.setValue(page)
        this.wrapper.update()
        expect(this.wrapper.find(".pagination-navigation-item__prev")
          .hasClass("is-disabled")).toBe(prevDisabled)
        expect(this.wrapper.find(".pagination-navigation-item__next")
          .hasClass("is-disabled")).toBe(nextDisabled)
      }

    })

    it("renders text", () => {
      this.createWrapper()
      expect(this.wrapper.find(".pagination-navigation-item__prev").text()).toBe("Previous Page")
      expect(this.wrapper.find(".pagination-navigation-item__next").text()).toBe("Next")
    })

    it('renders first page options', () => {
      this.checkActionStates(null,true, false)
    });

    it('renders second page options', () => {
      this.checkActionStates(2, false, false)
    });

    it('renders forth page options', () => {
      this.checkActionStates(4, false, true)
    });

    it("renders no pagination on no results", () => {
      this.searchkit.setResults({hits:{total:0}})
      this.createWrapper()
      expect(this.wrapper.find(".pagination-navigation").length).toBe(0)
    })

    it("both disabled on only one total page", () => {
      this.searchkit.setResults({hits:{total:10}})
      this.createWrapper()
      expect(this.wrapper.find(".pagination-navigation").length).toBe(1)
      this.checkActionStates(1, true, true)
    })

  });

  describe("interacting", () => {

    it("interact prev disabled", () => {
      this.createWrapper()
      this.accessor.state = this.accessor.state.setValue(1)

      this.wrapper
        .find(".pagination-navigation-item__prev")
        .simulate("mouseDown", {button:0})

      expect(this.accessor.state.getValue()).toBe(1)

    });


  })

});
