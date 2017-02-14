import {ValueState} from "../state"
import {StatefulAccessor} from "./StatefulAccessor";
import {Utils} from "../support"
import {find} from "lodash"
import {head} from "lodash"
import {map} from "lodash"
import {compact} from "lodash"

export interface SortingField {
  field:string
  options:Object
}

export interface SortingOption {
  label:string, field?:string,
  order?:string, defaultOption?:boolean,
  key?:string, fields?: Array<SortingField>
}

export interface SortingOptions {
  options:Array<SortingOption>
}

export class SortingAccessor extends StatefulAccessor<ValueState> {

  state = new ValueState()
  options:SortingOptions

  constructor(key, options:SortingOptions){
    super(key)
    this.options = options
    this.options.options = Utils.computeOptionKeys(
      this.options.options, ["field", "order"], "none"
    )
  }

  getSelectedOption(){
    let options = this.options.options
    return  find(options, {key: `${this.state.getValue()}` }) ||
            find(options, {defaultOption:true}) ||
            head(options)
  }

  getSortQuery(sortOption){
    if (sortOption.fields) {
      return map(sortOption.fields, (field: SortingField) => {
        return { [field.field]: field.options || {} }
      })
    } else if(sortOption.field && sortOption.order) {
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
