import {State} from "./State"

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
    return this.create(_.without(this.getValue(), val))
  }
  add(val) {
    return this.create(this.getValue().concat(val))
  }
  contains(val) {
    return _.contains(this.value, val)
  }
}
