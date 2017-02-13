import * as React from "react";

import { AbstractItemList, ItemListProps } from "./ItemListComponents"
import {
  FastClick,
  ReactComponentType,
  PureRender
} from "../../../"

import { ItemProps } from './ListProps'

import {defaults} from 'lodash'

export interface ItemHistogramComponentProps extends ItemProps {
  showCheckbox: boolean
}

@PureRender
export class ItemHistogramComponent extends React.Component<ItemHistogramComponentProps, {}> {

  getCountRatio(){
    const { rawCount, listDocCount } = this.props
    if ((rawCount == undefined) || (listDocCount == undefined) || (listDocCount == 0)) {
      return 0
    } else {
      return rawCount / listDocCount
    }
  }

  render(){
    const {
      bemBlocks, onClick, active, disabled, style, itemKey,
      label, count, showCount, showCheckbox, listDocCount } = this.props
    const block = bemBlocks.option
    const className = block()
      .state({ active, disabled, histogram: true })
      .mix(bemBlocks.container("item"))

    const barWidth = (this.getCountRatio()*100) + '%'

    return (
      <FastClick handler={onClick}>
        <div className={className} style={style} data-qa="option" data-key={itemKey}>
          <div className={block("bar-container")}>
            <div className={block("bar")} style={{width: barWidth}} />
          </div>
          {showCheckbox ? <input type="checkbox" data-qa="checkbox" checked={active} readOnly className={block("checkbox").state({ active }) } ></input> : undefined}
          <div data-qa="label" className={block("text") }>{label}</div>
          {(showCount && (count != undefined)) ? <div data-qa="count" className={block("count") }>{count}</div> : undefined}
        </div>
      </FastClick>
    )
  }
}

export class ItemHistogramList extends AbstractItemList {
    static defaultProps = defaults({
        //mod: "sk-item-histogram",
        itemComponent: ItemHistogramComponent,
        showCount: true,
    }, AbstractItemList.defaultProps)
}
