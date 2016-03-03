import * as React from "react";

import { ItemList } from '../../../../'
import { FacetFilter} from "./FacetFilter"

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const concat = require("lodash/concat")

import {FacetFilterProps, FacetFilterPropTypes} from "./FacetFilterProps"

export class MenuFilter2 extends FacetFilter<FacetFilterProps> {

  static propTypes = defaults({
  },FacetFilterPropTypes.propTypes)

  static defaultProps = defaults({
    listComponent: ItemList,
    operator:"OR"
  }, FacetFilter.defaultProps)

  static AllItem = {
    key:"All"
  }

  toggleFilter(option) {
    if (option === MenuFilter2.AllItem.key || this.accessor.state.contains(option)){
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
    return [this.accessor.state.getValue()[0] || MenuFilter2.AllItem.key]
  }

  getItems(){
    return concat(this.accessor.getBuckets(), MenuFilter2.AllItem)
  }


}
