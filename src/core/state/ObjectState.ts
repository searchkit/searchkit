import {State} from "./State"
import {isEmpty} from "lodash"

export class ObjectState extends State<Object>{

  getValue() {
    return this.value || {}
  }

  hasValue(){
    return !isEmpty(this.value)
  }
}
