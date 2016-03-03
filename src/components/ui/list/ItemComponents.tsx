import * as React from "react";

import {
  FastClick,
  ReactComponentType,
  PureRender
} from "../../../"

import { ItemProps } from './ListProps'

export interface ItemComponentProps extends ItemProps {
  showCheckbox: boolean
}

function itemRenderer(props: ItemComponentProps) {
  const {
    bemBlocks, toggleItem, active,
    label, count, showCount, showCheckbox} = props
  const block = bemBlocks.option
  const className = block()
    .state({ active })
    .mix(bemBlocks.container("item"))
  return (
    <FastClick handler={toggleItem}>
      <div className={className} data-qa="option">
        {showCheckbox ? <input type="checkbox" data-qa="checkbox" checked={active} readOnly className={block("checkbox").state({ active }) } ></input> : undefined}
        <div data-qa="label" className={block("text") }>{label}</div>
        {showCount ? < div data-qa="count" className={block("count") }>{count}</div> : undefined}
      </div>
    </FastClick>
  )
}

@PureRender
export class ItemComponent extends React.Component<ItemComponentProps, any>{

  static defaultProps = {
    showCount: true,
    showCheckbox:false
  }

  render() {
    return itemRenderer(this.props)
  }
}

@PureRender
export class CheckboxItemComponent extends React.Component<ItemComponentProps, any>{

  static defaultProps = {
    showCount: true,
    showCheckbox:true
  }

  render() {
    return itemRenderer(this.props)
  }
}
