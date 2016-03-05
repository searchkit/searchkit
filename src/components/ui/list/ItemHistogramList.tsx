import * as React from "react";

import { AbstractItemList, ItemListProps } from "./ItemListComponents"
import {
  FastClick,
  ReactComponentType,
  PureRender
} from "../../../"

import { ItemProps } from './ListProps'

const defaults = require('lodash/defaults')

export interface ItemHistogramComponentProps extends ItemProps {
  showCheckbox: boolean
}

@PureRender
export class ItemHistogramComponent extends React.Component<ItemHistogramComponentProps, {}> {
  
  getCountRatio(){
    const { count, listDocCount } = this.props
    if ((count == undefined) || (listDocCount == undefined) || (listDocCount == 0)) {
      return 0
    } else {
      return count / listDocCount
    }
  }
  
  render(){
    const {
      bemBlocks, onClick, active, disabled, style,
      label, count, showCount, showCheckbox, listDocCount } = this.props
    const block = bemBlocks.option
    const className = block()
      .state({ active, disabled })
      .mix(bemBlocks.container("item"))
    
    const histogramStyle = {
      position: 'absolute', backgroundColor: '#f0f0f0', top: 1, bottom: 1, right: 0, 
      display: 'inline-block',
      width: (this.getCountRatio()*100) + '%'
    }
      
    return (
      <FastClick handler={onClick}>
        <div className={className} style={style} data-qa="option">
          <div style={histogramStyle} />
          {showCheckbox ? <input type="checkbox" style={{zIndex: 1}} data-qa="checkbox" checked={active} readOnly className={block("checkbox").state({ active }) } ></input> : undefined}
          <div data-qa="label" className={block("text") } style={{zIndex: 1}}>{label}</div>
          {(showCount && (count != undefined)) ? <div data-qa="count" className={block("count") } style={{zIndex: 1, paddingRight: 4, color: '#999'}}>{count}</div> : undefined}
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
