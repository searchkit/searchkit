import {ValueState} from "../state"
import {Accessor} from "./Accessor"
import * as _ from "lodash"

export class SortingAccessor extends Accessor<ValueState> {

  state = new ValueState()
  options:any

  constructor(key, options){
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
