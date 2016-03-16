import * as React from "react";
import {mount} from "enzyme";
import {
  fastClick, hasClass, jsxToHTML, printPrettyHtml
} from "../../../components/__test__/TestHelpers"

import {Panel} from "../../../components"

import {
  renderComponent,
  RenderComponentType,
  RenderComponentPropType
} from "../../../"


describe("RenderComponent", ()=> {

  beforeEach(()=> {
    this.SubPanel = class SubPanel extends Panel {
    }
    this.SubPanel.defaultProps.title = "SubPanel"

    this.SubPanelElement = <Panel title="PanelElement"/>
    this.PanelReactClass = React.createClass({
      render(){
        return (<Panel title="PanelReactClass" {...this.props}>
          {this.props.children}
        </Panel>)
      }
    })

    this.PanelFunction = (props)=> {
      return (
        <Panel title="PanelFunction">
          {props.children}
        </Panel>
      )
    }

    this.mount = (component, props={})=> {
      this.wrapper = mount(renderComponent(
        component, props,
        <p>content..</p>
      ))
    }

  })

  it("React.Component class", ()=> {
    this.mount(this.SubPanel)
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel">
        <div className="sk-panel__header">SubPanel</div>
        <div className="sk-panel__content">
          <p>content..</p>
        </div>
      </div>
    ))
  })

  it("React Element", ()=> {
    this.mount(this.SubPanelElement)
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel">
        <div className="sk-panel__header">PanelElement</div>
        <div className="sk-panel__content">
          <p>content..</p>
        </div>
      </div>
    ))
  })

  it("React Class", ()=> {
    this.mount(this.PanelReactClass)
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel">
        <div className="sk-panel__header">PanelReactClass</div>
        <div className="sk-panel__content">
          <p>content..</p>
        </div>
      </div>
    ))
  })

  it("Render function", ()=> {
    this.mount(this.PanelFunction)
    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div className="sk-panel">
        <div className="sk-panel__header">PanelFunction</div>
        <div className="sk-panel__content">
          <p>content..</p>
        </div>
      </div>
    ))
  })

  it("Invalid component", ()=> {
    spyOn(console, "warn")
    try{
      this.mount(10)
      printPrettyHtml(this.wrapper.html())
    } catch (e){

    }
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid component", 10
    )

  })

})
