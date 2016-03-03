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
    const {toggleItem, bemBlocks, active, disabled, label, url} = this.props

    const className = bemBlocks.container("tab").state({ active, disabled })
    var component;
    if (url) {
      component = <li className={className}><a href={url}>{label}</a></li>
    } else {
      component = <li className={className}>{label}</li>
    }
    return <FastClick handler={toggleItem}>{component}</FastClick>
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

  render() {
    const { mod, itemComponent, items, selectedItems = [], toggleItem, disabled, showCount, translate, className } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    const options = map(items, (option) => {
      var label = translate(option.title || option.label || option.key)
      if (showCount && (option.doc_count !== undefined)) label += ` (${option.doc_count})`
      return React.createElement(itemComponent, {
        label,
        toggleItem: () => toggleItem(option.key),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled || option.disabled,
        active: includes(selectedItems, option.key)
      })
    })
    return (
      <ul className={bemBlocks.container().mix(className).state({ disabled }) }>
        {options}
        </ul>
    )
  }
}
