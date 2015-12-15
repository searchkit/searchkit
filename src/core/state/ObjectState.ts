import {State} from "./State"
import * as _ from "lodash";

export class ObjectState extends State<Object>{

  getValue() {
    return this.value || {}
  }

  hasValue() {
    return !_.isEmpty(this.value)
  }
}
