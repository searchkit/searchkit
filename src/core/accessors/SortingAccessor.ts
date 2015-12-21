import {ValueState} from "../state"
import {Accessor} from "./Accessor"
import * as _ from "lodash"

export interface SortingOptions {
  options:[{label:string, field:string, order:string}]
  mod?:string
}
export class SortingAccessor extends Accessor<ValueState> {

  state = new ValueState()
  options:SortingOptions

  constructor(key, options:SortingOptions){
    super(key)
    this.options = options;
  }

  buildOwnQuery(query){
    var selectedSortOption:any = _.findWhere(this.options.options, {label:this.state.getValue()})
    if (selectedSortOption) {
      query = query.setSort([{[selectedSortOption.field]: selectedSortOption.order}])
    }
    return query
  }
}
