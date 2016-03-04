import * as React from 'react'

export type RenderFunction = (props?:any, children?:any) => Element
export type Element = React.ReactElement<any>
export type RenderComponentType = React.ReactType | Element | RenderFunction;

export function renderComponent(component:RenderComponentType, props={}, children=null){
  if (component["prototype"] instanceof React.Component){
    return React.createElement(component as React.ComponentClass<any>, props, children)
  } else if (React.isValidElement(component)){
    return React.cloneElement(component as Element, props, children);
  } else if ((typeof component) === 'function'){
    return (component as RenderFunction)(props, children || [])
  }
  console.warn("Invalid component", component)
  return null
}
