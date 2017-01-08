import * as React from "react";
import {compact} from "lodash"

const mixClasses = (...classes) => {
  return compact(classes).join(" ")
}
export const LayoutBuilder = (className)=> {
  return (props)=> (
      <div className={mixClasses(className, props.className)}>
        {props.children}
      </div>
  )
}
export const LayoutBody = LayoutBuilder("sk-layout__body")
export const LayoutResults = LayoutBuilder("sk-layout__results sk-results-list")
export const ActionBar = LayoutBuilder("sk-results-list__action-bar sk-action-bar")
export const ActionBarRow = LayoutBuilder("sk-action-bar-row")
export const SideBar = LayoutBuilder("sk-layout__filters")

export const TopBar = (props)=> (
  <div className={mixClasses("sk-layout__top-bar sk-top-bar", props.className)}>
    <div className="sk-top-bar__content">
      {props.children}
    </div>
  </div>
)

export const Layout = (props) => {
  const sizeClass = props.size ? "sk-layout__size-"+props.size : null
  return (
    <div className={mixClasses("sk-layout", props.className, sizeClass)}>
      {props.children}
    </div>
  )
}
