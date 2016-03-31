import * as React from "react";
const compact = require("lodash/compact")

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
export const Layout = LayoutBuilder("sk-layout")
export const LayoutBody = LayoutBuilder("sk-layout__body")
export const LayoutResults = LayoutBuilder("sk-layout__results sk-results-list")
export const ActionBar = LayoutBuilder("sk-results-list__action-bar sk-action-bar")
export const ActionBarInfo = LayoutBuilder("sk-action-bar__info")
export const ActionBarFilters = LayoutBuilder("sk-action-bar__filters")
export const SideBar = LayoutBuilder("sk-layout__filters")

export const TopBar = (props)=> (
  <div className={mixClasses("sk-layout__top-bar sk-top-bar", props.className)}>
    <div className="sk-top-bar__content">
      {props.children}
    </div>
  </div>
)
