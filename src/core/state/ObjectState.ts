import {State} from "./State"

export class ObjectState extends State<Object>{

  getValue() {
    return this.value || {}
  }
}
