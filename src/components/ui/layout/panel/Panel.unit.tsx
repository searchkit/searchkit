import * as React from "react";
import {mount} from "enzyme";
import {Panel} from "./Panel"
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../../__test__/TestHelpers"

describe("Panel", ()=> {
  beforeEach(()=> {
    this.wrapper = mount(
      <Panel title="My Panel">
        <p>panel content...</p>
      </Panel>
    )
  })
  it("should render correctly", ()=> {
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel">
        <div className="sk-panel__header">My Panel</div>
        <div className="sk-panel__content">
          <p>panel content...</p>
        </div>
      </div>
    ))
  })

  it("should be collapsable", ()=> {
    this.wrapper = mount(
      <Panel title="My Panel" collapsable={true}>
        <p>panel content...</p>
      </Panel>
    )
    //this markup will change in react 15.x
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel">
        <div className="sk-panel__header is-collapsable">
          <span className="sk-arrow-right"></span>
          <span> </span><span>My Panel</span>
        </div>
        <div className="sk-panel__content is-collapsed">
          <p>panel content...</p>
        </div>
      </div>
    ))

    let expectIsCollapsed = (shouldBeCollapsed)=> {
      let arrowClass = (shouldBeCollapsed) ? ".sk-arrow-right": ".sk-arrow-down"
      expect(this.wrapper.find(".sk-panel__content").hasClass("is-collapsed"))
        .toBe(shouldBeCollapsed)
      expect(this.wrapper.find(arrowClass).length).toBe(1)
    }

    //test collapsing
    expectIsCollapsed(true)
    this.wrapper.find(".sk-panel__header").simulate("click")
    expectIsCollapsed(false)
    this.wrapper.find(".sk-panel__header").simulate("click")
    expectIsCollapsed(true)

  it("can be disabled", ()=> {
    expect(this.wrapper.find(".sk-panel").hasClass("is-disabled")).toBe(false)
    this.wrapper.setProps({disabled:true})
    expect(this.wrapper.find(".sk-panel").hasClass("is-disabled")).toBe(true)
  })

  it("mod + classname can be updated", ()=> {
    this.wrapper.setProps({mod:"sk-panel-updated", className:"my-custom-class"})
    expect(this.wrapper.find(".sk-panel-updated").hasClass("my-custom-class")).toBe(true)
  })


  })

})
