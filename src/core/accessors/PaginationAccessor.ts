import {ValueState} from "../state"
import {Accessor} from "./Accessor"
import * as _ from "lodash"

export class PaginationAccessor extends Accessor<ValueState> {
  state = new ValueState()

  onStateChange(oldState){
    if(oldState[this.urlKey] == this.state.getValue()){
      this.state = this.state.clear()
    }
  }

  buildOwnQuery(query){
    let from = (query.getSize() || 20) * (Number(this.state.getValue()) -1 )
    if(from > 0){
      return query.setFrom(from)
    }
    return query
  }
}
