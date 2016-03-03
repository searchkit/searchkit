import * as React from "react";

import { ItemComponent, CheckboxItemComponent } from "./ItemComponents"
import { ListProps } from "./ListProps"

const block = require('bem-cn')

const map = require("lodash/map")
const includes = require("lodash/includes")
const defaults = require("lodash/defaults")

export interface ItemListProps extends ListProps {
  itemComponent?: any
}

export class AbstractItemList extends React.Component<ItemListProps, {}> {
  static defaultProps: any = {
    mod: "sk-item-list",
    showCount: true,
    itemComponent: CheckboxItemComponent,
    translate: str => str
  }

  render() {
    const {
      mod, itemComponent, items, selectedItems = [], translate,
      toggleItem, disabled, showCount, className
    } = this.props

    const bemBlocks = {
      container: block(mod),
      option: block(`${mod}-option`)
    }

    const actions = map(items, (option) => {
      const label = option.title || option.label || option.key
      return React.createElement(itemComponent, {
        label: translate(label),
        toggleItem: () => toggleItem(option.key),
        bemBlocks: bemBlocks,
        key: option.key,
        count: option.doc_count,
        showCount,
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

export class ItemList extends AbstractItemList {
    static defaultProps = defaults({
        itemComponent: ItemComponent
    }, AbstractItemList.defaultProps)
}

export class CheckboxItemList extends AbstractItemList {
    static defaultProps = defaults({
        itemComponent: CheckboxItemComponent
    }, AbstractItemList.defaultProps)
}
