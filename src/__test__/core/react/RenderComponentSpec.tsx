import * as React from "react";
import * as PropTypes from "prop-types";
import {mount} from "enzyme";
import {
  fastClick, hasClass, printPrettyHtml
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

    this.PanelReactClass = class PanelReactClass extends React.Component {
      static contextTypes = {
        color:PropTypes.string
      }
      render(){
        return (<Panel title={"PanelReactClass " + this.context.color} {...this.props}>
          {this.props.children}
        </Panel>)
      }
    }



    this.PanelFunction = (props, context)=> {
      return (
        <Panel title={"PanelFunction " + context.color}>
          {props.children}
        </Panel>
      )
    }
    this.PanelFunction.contextTypes = {
      color:PropTypes.string
    }

    class Provider extends React.Component<any, any>{
      static childContextTypes = {
        color: PropTypes.string
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
    expect(this.wrapper).toMatchSnapshot()

  })

  it("React Element", ()=> {
    this.mount(this.SubPanelElement)
    expect(this.wrapper).toMatchSnapshot()
  })

  it("React Class", ()=> {
    this.mount(this.PanelReactClass)
    expect(this.wrapper).toMatchSnapshot()
  })

  it("Render function", ()=> {
    this.mount(this.PanelFunction)
    expect(this.wrapper).toMatchSnapshot()
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
