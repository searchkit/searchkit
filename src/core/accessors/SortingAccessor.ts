import {ValueState} from "../state"
import {StatefulAccessor} from "./StatefulAccessor"
const find = require("lodash/find")

export interface SortingOption {
  label:string, field:string, order:string
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

  buildOwnQuery(query){
    var selectedSortOption:any = find(this.options.options, {label:this.state.getValue()})
    if (selectedSortOption) {
      query = query.setSort([{[selectedSortOption.field]: selectedSortOption.order}])
    }
    return query
  }
}
