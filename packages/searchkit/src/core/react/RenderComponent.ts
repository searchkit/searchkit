import * as React from 'react'
import * as PropTypes from "prop-types"

const omitBy = require("lodash/omitBy")
const isUndefined = require("lodash/isUndefined")

export type RenderFunction = (props?:any, children?:any) => Element
export type Element = React.ReactElement<any>
export type RenderComponentType<P> = React.ComponentClass<P> | React.ClassicComponentClass<P> | Element | RenderFunction | any

export const RenderComponentPropType = PropTypes.oneOfType([
  function(props:any, propName: string) {
     if(isUndefined(props[propName]) || (props[propName]["prototype"] instanceof React.Component)) {
       return null
     }
  },
  PropTypes.element,
  PropTypes.func,
])

export function renderComponent(component:RenderComponentType<any>, props={}, children=null): React.ReactElement<any> {
  let isReactComponent = (
    component["prototype"] instanceof React.Component ||
    (component["prototype"] && component["prototype"].isReactComponent) ||
    typeof component === 'function'
  )
  if (isReactComponent){
    return React.createElement(
      component as React.ComponentClass<any>,
      props, children
    )
  } else if (React.isValidElement(component)){
    return React.cloneElement(
      component as Element,
      omitBy(props, isUndefined), children
    );
  }
  console.warn("Invalid component", component)
  return null
}
