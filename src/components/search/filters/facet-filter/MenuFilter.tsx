import * as React from "react";

import { ItemList } from '../../../ui'
import { FacetFilter} from "./FacetFilter"

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const concat = require("lodash/concat")

import {FacetFilterProps, FacetFilterPropTypes} from "./FacetFilterProps"

const allItem = {
  key:"$all", label: "All"
}

export class MenuFilter extends FacetFilter<FacetFilterProps> {

  static propTypes = defaults({
  },FacetFilterPropTypes.propTypes)

  static defaultProps = defaults({
    listComponent: ItemList,
    operator:"OR"
  }, FacetFilter.defaultProps)

  toggleFilter(option) {
    if (option === allItem.key || this.accessor.state.contains(option)){
      this.accessor.state = this.accessor.state.clear()
    } else {
      this.accessor.state = this.accessor.state.setValue([option]);
    }
    this.searchkit.performSearch()
  }

  setFilters(options){
    this.toggleFilter(options[0])
  }

  getSelectedItems() {
    return [this.accessor.state.getValue()[0] || allItem.key]
  }

  getItems(){
    const all = {
      key: allItem.key,
      label: allItem.label,
      doc_count: this.accessor.getDocCount()
    }
    return concat([all], this.accessor.getBuckets())
  }


}
