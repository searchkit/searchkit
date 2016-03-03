import * as React from "react";
import {
  FastClick,
  ReactComponentType
} from "../../../"

import {ListProps, ItemProps} from "./ListProps"


const block = require('bem-cn')
const map = require("lodash/map")
const find = require("lodash/find")
const includes = require("lodash/includes")


const ToggleItem = ({toggleItem, bemBlocks, active, disabled, label, url}) => {

  const className = bemBlocks.container("action").state({ active, disabled })

  return (
    <FastClick handler={toggleItem}>
      <div className={className}>{label}</div>
    </FastClick>
  )
}

export interface ToggleProps extends ListProps {
  itemComponent?: ReactComponentType<any>
}

export class Toggle extends React.Component<ToggleProps, any> {

  static defaultProps: any = {
    mod: "sk-toggle",
    itemComponent: ToggleItem
  }

  render() {
    const { translate, mod, itemComponent, items, selectedItems = [], toggleItem, disabled, showCount, className } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    const actions = map(items, (option) => {
      var label = translate(option.title || option.label || option.key)
      if (showCount && (option.doc_count !== undefined)) label += ` (${option.doc_count})`
      return React.createElement(itemComponent, {
        label:label,
        toggleItem: () => toggleItem(option.key),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled || option.disabled,
        active: includes(selectedItems, option.key)
      })
    })
    return (
      <div className={bemBlocks.container().mix(className).state({ disabled }) }>
        {actions}
      </div>
    )
  }
}
