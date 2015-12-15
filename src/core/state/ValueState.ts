import {State} from "./State"

export class ValueState extends State<string|number> {

  toggle(value){
    if(this.value === value){
      return this.clear()
    } else {
      return this.setValue(value)
    }
  }
}
