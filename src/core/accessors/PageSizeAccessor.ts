import {ValueState} from "../state/State"
import {Accessor} from "./Accessor"
import * as _ from "lodash"

export class PageSizeAccessor extends Accessor<ValueState> {

  size:number
  state = new ValueState()
  constructor(key, size){
    super(key)
    this.size = size
  }

  buildOwnQuery(query){
    return query.setSize(this.size)
  }
}
