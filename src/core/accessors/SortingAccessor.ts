import {ValueState} from "../state"
import {StatefulAccessor} from "./StatefulAccessor"
const find = require("lodash/find")
const head = require("lodash/head")

export interface SortingOption {
  label:string, field?:string,
  order?:string, defaultOption?:boolean
}

export interface SortingOptions {
  options:Array<SortingOption>
}

export class SortingAccessor extends StatefulAccessor<ValueState> {

  state = new ValueState()
  options:SortingOptions

  constructor(key, options:SortingOptions){
    super(key)
    this.options = options;
  }


  getSelectedOption(){
    let options = this.options.options
    return  find(options, {label:this.state.getValue()}) ||
            find(options, {defaultOption:true}) ||
            head(options)
  }

  getSortQuery(sortOption){
    if(sortOption.field && sortOption.order) {
      return [{[sortOption.field]: sortOption.order}]
    } else if (sortOption.field) {
      return [sortOption.field]
    }
    return null
  }

  buildOwnQuery(query){
    let selectedSortOption = this.getSelectedOption()
    if (selectedSortOption) {
      let sortQuery = this.getSortQuery(selectedSortOption)
      if(sortQuery){
        query = query.setSort(sortQuery)
      }
    }
    return query
  }
}
