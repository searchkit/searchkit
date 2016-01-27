import {State} from "./State"
const contains = require("lodash/includes")
const without = require("lodash/without")

export class ArrayState extends State<Array<string|number>> {
  getValue() {
    return this.value || []
  }
  toggle(val) {
    if (this.contains(val)) {
      return this.remove(val)
    } else {
      return this.add(val)
    }
  }
  clear(){
    return this.create([])
  }
  remove(val) {
    return this.create(without(this.getValue(), val))
  }
  add(val) {
    return this.create(this.getValue().concat(val))
  }
  contains(val) {
    return contains(this.value, val)
  }
}
