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
      contextTypes:{
        color:React.PropTypes.string
      },
      render(){
        return (<Panel title={"PanelReactClass " + this.context.color} {...this.props}>
          {this.props.children}
        </Panel>)
      }
    })

    this.PanelFunction = (props, context)=> {
      return (
        <Panel title={"PanelFunction " + context.color}>
          {props.children}
        </Panel>
      )
    }
    this.PanelFunction.contextTypes = {
      color:React.PropTypes.string
    }

    class Provider extends React.Component<any, any>{
      static childContextTypes = {
        color: React.PropTypes.string
      }
      getChildContext(){
        return {color:"purple"}
      }
      render(){
        return this.props.children
      }
    }

    this.mount = (component, props={})=> {
      this.wrapper = mount(
        <Provider>
          {renderComponent(
            component, props,
            <p>content..</p>
          )}
        </Provider>
      )
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
        <div className="sk-panel__header">PanelReactClass purple</div>
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
        <div className="sk-panel__header">PanelFunction purple</div>
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
      // printPrettyHtml(this.wrapper.html())
    } catch (e){

    }
    expect(console.warn).toHaveBeenCalledWith(
      "Invalid component", 10
    )

  })

})
