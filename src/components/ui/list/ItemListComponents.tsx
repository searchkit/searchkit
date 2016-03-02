import * as React from "react";

import { ItemComponent, CheckboxItemComponent } from "./ItemComponents"

const block = require('bem-cn')

const map = require("lodash/map")
const includes = require("lodash/includes")
const defaults = require("lodash/defaults")

// require('./ItemList.scss');

export class AbstractFilterItemList extends React.Component<any, {}> {
  static defaultProps: any = {
    mod: "sk-item-list",
    urlBuilder: () => undefined
  }

  render() {
    const {
      mod, itemComponent, items, selectedItems = [], translate,
      toggleItem, disabled, urlBuilder, showCount
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
        url: urlBuilder && urlBuilder(option),
        count: option.doc_count,
        showCount,
        active: includes(selectedItems, option.key)
      })
    })
    return (
      <div className={bemBlocks.container().state({ disabled }) }>
        {actions}
      </div>
    )
  }
}

export class ItemList extends AbstractFilterItemList {
    static defaultProps = defaults({
        itemComponent: ItemComponent
    }, AbstractFilterItemList.defaultProps)
}

export class CheckboxItemList extends AbstractFilterItemList {
    static defaultProps = defaults({
        itemComponent: CheckboxItemComponent
    }, AbstractFilterItemList.defaultProps)
}
