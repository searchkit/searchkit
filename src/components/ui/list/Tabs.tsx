import * as React from "react"

import {
FastClick,
ReactComponentType
} from "../../../"

import {ListProps, ItemProps} from "./ListProps"

const block = require('bem-cn')
const map = require("lodash/map")
const find = require("lodash/find")
const includes = require("lodash/includes")

export interface TabItemProps extends ItemProps {
  url?: string
}

export class Tab extends React.Component<TabItemProps, {}> {
  render() {
    const {onClick, bemBlocks, active, disabled, label, url} = this.props

    const className = bemBlocks.container("tab").state({ active, disabled })
    var component;
    if (url) {
      component = <li className={className}><a href={url}>{label}</a></li>
    } else {
      component = <li className={className}>{label}</li>
    }
    return <FastClick handler={onClick}>{component}</FastClick>
  }
}

export interface TabsProps extends ListProps {
  itemComponent?: ReactComponentType<any>
}

export class Tabs extends React.Component<TabsProps, any> {

  static defaultProps: any = {
    mod: "sk-tabs",
    itemComponent: Tab
  }

  getSelectedValue() {
    const { selectedItems = []} = this.props
    if (selectedItems.length == 0) return null
    return selectedItems[0]
  }

  render() {
    const { mod, itemComponent, items, selectedItems = [], setItems, disabled, showCount, translate, className } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    const selectedKey = this.getSelectedValue()

    const options = map(items, (option) => {
      var label = translate(option.title || option.label || option.key)
      if (showCount && (option.doc_count !== undefined)) label += ` (${option.doc_count})`
      return React.createElement(itemComponent, {
        label,
        onClick: () => setItems([option.key]),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled || option.disabled,
        active: option.key === selectedKey
      })
    })
    return (
      <ul className={bemBlocks.container().mix(className).state({ disabled }) }>
        {options}
        </ul>
    )
  }
}
