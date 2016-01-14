import * as React from "react";
import {mount} from "enzyme";
import {Pagination} from "../src/Pagination.tsx";
import {SearchkitManager} from "../../../../core";
import * as _ from "lodash";
import * as sinon from "sinon";

describe("Pagination tests", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:true})

    this.searchkit.translateFunction = (key)=> {
      return {

      }[key]
    }

    this.createWrapper = () => {
      this.wrapper = mount(
        <Pagination searchkit={this.searchkit} />
      );
      this.accessor = this.searchkit.accessors.getAccessors()[0]
    }

    this.searchkit.query.query = {
      size: 10
    }

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

    it('renders first page options', () => {
      this.checkActionStates(null,true, false)
    });

    it('renders second page options', () => {
      this.checkActionStates(2, false, false)
    });

    it('renders forth page options', () => {
      this.checkActionStates(4, false, true)
    });

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
