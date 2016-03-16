import * as React from 'react'

import {PureRender} from "./pure-render"
const isUndefined = require('lodash/isUndefined')
const defaults = require('lodash/defaults')

export type RenderFunction = (props?:any, children?:any) => Element
export type Element = React.ReactElement<any>
export type RenderComponentType<P> = React.ComponentClass<P> | React.ClassicComponentClass<P> | Element | RenderFunction;

export const RenderComponentPropType = React.PropTypes.oneOfType([
  function(props:any, propName: string, componentName: string) {
    return isUndefined(props[propName]) || (props[propName]["prototype"] instanceof React.Component)
  },
  React.PropTypes.element,
  React.PropTypes.func,
])


@PureRender
class FunctionComponent extends React.Component<any, any> {
  render(){
    const {fun, props} = this.props
    return fun(props)
  }
}

export function renderComponent(component:RenderComponentType<any>, props={}, children=null){
  if (component["prototype"] instanceof React.Component || (component["prototype"] && component["prototype"].isReactComponent)){
    return React.createElement(component as React.ComponentClass<any>, props, children)
  } else if (React.isValidElement(component)){
    return React.cloneElement(component as Element, props, children);
  } else if ((typeof component) === 'function'){
    const funProps = (children != null) ? defaults(props, {children}) : props
    return React.createElement(FunctionComponent, {
      key: props["key"],
      fun: component,
      props: funProps
    })

  }
  console.warn("Invalid component", component)
  return null
}
