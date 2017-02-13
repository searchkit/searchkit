import * as React from "react";

import {
  FastClick,
  ReactComponentType,
  PureRender,
  renderComponent,
} from "../../../"

import { ItemComponent } from './ItemComponents'
import { ListProps, ItemProps } from './ListProps'

let block = require("bem-cn")

import {map} from "lodash"
import {includes} from "lodash"
import {sortBy} from "lodash"
import {minBy} from "lodash"
import {maxBy} from "lodash"
import {identity} from "lodash"

function computeMinMax(items, field) {
  if (!items || items.length == 0) return { min: 0, max: 0 }
  return {
    min: minBy(items, field)[field],
    max: maxBy(items, field)[field]
  }
}

export interface TagCloudProps extends ListProps {
  minFontSize?: number
  maxFontSize?: number
  itemComponent?: ReactComponentType<ItemProps>
}

@PureRender
export class TagCloud extends React.Component<TagCloudProps, any> {

  static defaultProps: any = {
    mod: "sk-tag-cloud",
    itemComponent: ItemComponent,
    showCount: false,
    minFontSize: 1, // In em
    maxFontSize: 1.5,
    translate: identity,
    countFormatter:identity
  }

  render() {
    const { mod, className, disabled, items, translate } = this.props

    const bemBlocks = {
      container: block(mod),
      option: block(`${mod}-option`)
    }

    const sortedItems = sortBy(items, it => translate(it.title || it.label || it.key).toLowerCase())
    const { min, max } = computeMinMax(items, "doc_count")

    return (
      <div className={bemBlocks.container().mix(className).state({ disabled }) }>
        {map(sortedItems, (item) => this.renderItem(item, bemBlocks, min, max)) }
      </div>
    )
  }

  renderItem(item, bemBlocks, min, max) {
    const {
      itemComponent, minFontSize, maxFontSize,showCount, countFormatter,
      selectedItems = [], toggleItem, disabled, translate } = this.props

    const sizeRatio = (min === max) ? 0.5 : ((item.doc_count - min) / (max - min))
    const fontSize = minFontSize + sizeRatio * (maxFontSize - minFontSize) // TODO : make ratio function customizable (square, log, etc.)
    return renderComponent(itemComponent, {
      label: translate(item.title || item.label || item.key),
      onClick: () => toggleItem(item.key),
      bemBlocks: bemBlocks,
      key: item.key,
      itemKey: item.key,
      disabled: disabled || item.disabled,
      active: includes(selectedItems, item.key),
      style: { fontSize: fontSize + 'em' },
      showCount,
      count: countFormatter(item.doc_count)
    })
  }
}
