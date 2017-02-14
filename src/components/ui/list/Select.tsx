import * as React from "react";

import { ItemComponent, CheckboxItemComponent } from "./ItemComponents"
import { ListProps } from "./ListProps"

import {PureRender} from "../../../core"
let block = require("bem-cn")
import {map} from "lodash"
import {filter} from "lodash"
import {transform} from "lodash"
import {find} from "lodash"
import {identity} from "lodash"

@PureRender
export class Select extends React.Component<ListProps, any> {

  static defaultProps: any = {
    mod: "sk-select",
    showCount: true,
    translate:identity,
    countFormatter:identity
  }

  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e){
    const { setItems } = this.props
    const key = e.target.value
    setItems([key])
  }

  getSelectedValue(){
    const { selectedItems=[] } = this.props
    if (selectedItems.length == 0) return null
    return selectedItems[0]
  }

  render() {
    const { mod, className, items,
      disabled, showCount, translate, countFormatter } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    return (
      <div className={bemBlocks.container().mix(className).state({ disabled }) }>
        <select onChange={this.onChange} value={this.getSelectedValue()}>
          {map(items, ({key, label, title, disabled, doc_count}, idx) => {
            var text = translate(label || title || key)
            if (showCount && doc_count !== undefined) text += ` (${countFormatter(doc_count)})`
            return <option key={key} value={key} disabled={disabled}>{text}</option>
          })}
          </select>
      </div>
    )
  }
}
