import * as React from 'react'

export function renderComponent(component, props={}, children=[]){
    console.log('render', component, props, children)
    console.log('=>', component instanceof React.Component, React.isValidElement(component))
  if (component.prototype instanceof React.Component){
    return React.createElement(component, props, children)
  } else if (React.isValidElement(component)){
    return React.cloneElement(component, props, children);
  } else if ((typeof component) === 'function'){
    return component(props, children)
  }
  console.warn("Invalid component", component)
  return null
}
