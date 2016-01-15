import {ValueState} from "../state"
import {StatefulAccessor} from "./StatefulAccessor"

export class BaseQueryAccessor extends StatefulAccessor<ValueState> {

  constructor(key){
    super(key)
    this.state = new ValueState()
  }

  keepOnlyQueryState(){
    this.setQueryString(this.getQueryString(), true)
  }

  setQueryString(queryString, withReset=false){
    if(withReset){
      this.searchkit.resetState()
    }
    this.state = this.state.setValue(queryString)
  }

  getQueryString(){
    return this.state.getValue()
  }

}
