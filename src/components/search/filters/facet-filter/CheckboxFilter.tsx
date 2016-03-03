import * as React from "react";

import { FacetAccessor} from '../../../../core'
import { ItemList} from "../../../ui"
import { FacetFilter} from "./FacetFilter"

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const concat = require("lodash/concat")
const assign = require("lodash/assign")

import {FacetFilterProps, FacetFilterPropTypes} from "./FacetFilterProps"

export interface CheckboxFilterProps extends FacetFilterProps{
  value:string
}
export class CheckboxFilter extends FacetFilter<CheckboxFilterProps> {

  static propTypes = defaults({
    value:React.PropTypes.string.isRequired
  },FacetFilterPropTypes.propTypes)

  static defaultProps = defaults({
    size:1,
    showMore:false
  }, FacetFilter.defaultProps)
  
  getAccessorOptions(){
    let options = super.getAccessorOptions()
    return assign(options, {include:[this.props.value]})
  }

  getItems(){
    let key = this.props.value
    return [this.accessor.getBuckets()[0] || {key, doc_count:0}]
  }

}
