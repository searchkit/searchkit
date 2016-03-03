import * as React from "react";

import {
FastClick,
ReactComponentType,
PureRender
} from "../../../"

import { ListProps, ItemProps } from './ListProps'

const block = require('bem-cn')

const map = require("lodash/map")
const includes = require("lodash/includes")
const sortBy = require("lodash/sortBy")
const minBy = require("lodash/minBy")
const maxBy = require("lodash/maxBy")

function computeMinMax(items, field) {
  if (!items || items.length == 0) return { min: 0, max: 0 }
  return {
    min: minBy(items, field)[field],
    max: maxBy(items, field)[field]
  }
}

export interface TagCloudItemProps extends ItemProps {
  url?: string
  fontSize: number
}

export class TagCloudItem extends React.Component<TagCloudItemProps, {}> {
  render() {
    const {toggleItem, bemBlocks, active, disabled, label, url, fontSize} = this.props

    const className = bemBlocks.container("item").state({ active, disabled })
    var component;
    const style = { fontSize }
    if (url) {
      component = <a href={url} className={className} data-qa="option" style={style}>{label}</a>
    } else {
      component = <span className={className} data-qa="option" style={style}>{label}</span>
    }
    return <FastClick handler={toggleItem}>{component}</FastClick>
  }
}

export interface TagCloudProps extends ListProps {
  minFontSize?: number
  maxFontSize?: number
  itemComponent?: ReactComponentType<any>
}

export class TagCloud extends React.Component<TagCloudProps, any> {

  static defaultProps: any = {
    mod: "sk-tag-cloud",
    urlBuilder: () => undefined,
    itemComponent: TagCloudItem,
    showCount: false,
    minFontSize: 10, // Switch to em and use css on parent ?
    maxFontSize: 15,
    translate: (str) => str
  }

  render() {
    const { mod, className, disabled, items, translate } = this.props

    const bemBlocks = {
      container: block(mod)
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
    const { itemComponent, minFontSize, maxFontSize, showCount, selectedItems = [], toggleItem, urlBuilder, disabled, translate } = this.props

    var label = item.title || item.label || item.key
    if (showCount && (item.doc_count !== undefined)) label += ` (${item.doc_count})`
    const sizeRatio = (min === max) ? 0.5 : ((item.doc_count - min) / (max - min))
    const fontSize = minFontSize + sizeRatio * (maxFontSize - minFontSize) // TODO : make ratio function customizable (square, log, etc.)
    return React.createElement(itemComponent, {
      label: translate(label),
      toggleItem: () => toggleItem(item.key),
      bemBlocks: bemBlocks,
      key: item.key,
      disabled: disabled || item.disabled,
      url: urlBuilder && urlBuilder(item),
      active: includes(selectedItems, item.key),
      fontSize
    })
  }
}
