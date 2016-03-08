import * as React from "react";
import {
  SearchkitComponent,
  SearchkitComponentProps,
  PageSizeAccessor,
  FastClick,
  PaginationAccessor
} from "../../../core"

const map = require("lodash/map")

import { Select } from "../../ui"

export class PageSizeSelector extends SearchkitComponent<any, any> {

  static defaultProps = {
    listComponent: Select
  }

  getPageSizeAccessor(){
    return this.searchkit.getAccessorByType(PageSizeAccessor)
  }

  setSize(size){
    let pageSizeAccessor = this.getPageSizeAccessor()
    if(size){
      pageSizeAccessor.setSize(Number(size))
      this.searchkit.performSearch()
    }
  }

  setItems(sizes){
    this.setSize(sizes[0])
  }

  render() {
    let pageSizeAccessor = this.getPageSizeAccessor()
    if(pageSizeAccessor){
      let options = map(this.props.options, (option)=> {
        return {key:option, label:option}
      })
      let selectedSize = pageSizeAccessor.getSize()
      const {mod, className} = this.props
      return React.createElement(this.props.listComponent, {
        mod, className,
        disabled: !this.hasHits(),
        items: options,
        selectedItems: [selectedSize],
        toggleItem: this.setSize.bind(this),
        setItems:this.setItems.bind(this),
        urlBuilder: (item) => {},
        translate:this.translate
      })
    }
    return null

  }

}
