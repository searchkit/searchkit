import {StatefulAccessor} from "./StatefulAccessor";
import {ValueState} from "../state"

export class PageSizeAccessor extends StatefulAccessor<ValueState> {
  state = new ValueState()
  constructor(public defaultSize:number){
    super("size")
  }

  setSize(size){
    if(this.defaultSize == size){
      this.state = this.state.clear()
    } else {
      this.state = this.state.setValue(size)
    }
  }

  getSize(){
    return Number(this.state.getValue() || this.defaultSize)
  }

  buildSharedQuery(query){
    return query.setSize(this.getSize())
  }
}
