import * as React from "react";

import { ItemList, Panel, CheckboxItemList } from '../../../ui'
import { FacetFilter} from "./FacetFilter"

import {defaults} from "lodash"
import {map} from "lodash"
import {concat} from "lodash"
import {isUndefined} from "lodash"

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
    let selectedValue = this.accessor.state.getValue()[0]
    return [!isUndefined(selectedValue) ? selectedValue:allItem.key]
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
