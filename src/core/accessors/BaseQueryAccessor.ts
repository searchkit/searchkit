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

export class NoopQueryAccessor extends BaseQueryAccessor {
  keepOnlyQueryState(){
    console.warn("keepOnlyQueryState called, No Query Accessor exists")
  }

  setQueryString(queryString, withReset=false){
    console.warn("setQueryString called, No Query Accessor exists")
  }

  getQueryString(){
    console.warn("getQueryString called, No Query Accessor exists")
    return ""
  }
}

export const noopQueryAccessor = new NoopQueryAccessor(null)
