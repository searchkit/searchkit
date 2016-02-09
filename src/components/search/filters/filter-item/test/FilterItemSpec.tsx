import * as React from "react";
import {mount} from "enzyme";
import {FilterItemComponent, FilterCheckboxItemComponent} from "../src/FilterItem";
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../../__test__/TestHelpers"
import {SearchkitManager} from "../../../../../core";
import * as sinon from "sinon";
const bem = require("bem-cn");

const _ = require("lodash")

describe("FilterItem", () => {

  it("FilterItemComponent", ()=> {

    const spy = sinon.spy()

    const createRender = (overrideProps={}) => {

      const props = _.extend({
        bemBlocks:{
          container: bem("container"),
          option: bem("option")
        },
        toggleFilter: spy,
        translate:() => {},
        selected:true,
        label:"test",
        count:1
      },overrideProps)

      this.wrapper = mount(
        <FilterItemComponent {...props} />
      )
    }

    createRender()

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="option container__item is-selected" data-qa="option">
        <div data-qa="label" className="option__text">test</div>
        <div data-qa="count" className="option__count">1</div>
      </div>
    ))

    createRender({selected:false})

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="option container__item" data-qa="option">
        <div data-qa="label" className="option__text">test</div>
        <div data-qa="count" className="option__count">1</div>
      </div>
    ))
    expect(spy.called).toBe(false)

    fastClick(this.wrapper.find(".option"))
    this.wrapper.update()

    expect(spy.calledOnce).toBe(true)

  })

  it("FilterItemCheckboxComponent", ()=> {

    const spy = sinon.spy()

    const createRender = (overrideProps={}) => {

      const props = _.extend({
        bemBlocks:{
          container: bem("container"),
          option: bem("option")
        },
        toggleFilter: spy,
        translate:() => {},
        selected:true,
        label:"test",
        count:1
      },overrideProps)

      this.wrapper = mount(
        <FilterCheckboxItemComponent {...props} />
      )
    }

    createRender()

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="option container__item is-selected" data-qa="option">
      <input type="checkbox" data-qa="checkbox" checked={true} readOnly={true} className="option__checkbox is-selected"/>
        <div data-qa="label" className="option__text">test</div>
        <div data-qa="count" className="option__count">1</div>
      </div>
    ).replace(/is-selected"\/>/g, `is-selected">`))

    createRender({selected:false})

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="option container__item" data-qa="option">
        <input type="checkbox" data-qa="checkbox" readOnly={true} className="option__checkbox"/>
        <div data-qa="label" className="option__text">test</div>
        <div data-qa="count" className="option__count">1</div>
      </div>
    ).replace(/__checkbox"\/>/g, `__checkbox">`))

    expect(spy.called).toBe(false)

    fastClick(this.wrapper.find(".option"))
    this.wrapper.update()

    expect(spy.calledOnce).toBe(true)

  })

})
