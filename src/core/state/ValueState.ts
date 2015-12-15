import {State} from "./State"

export class ValueState extends State<string|number> {

  toggle(value){
    if(this.is(value)){
      return this.clear()
    } else {
      return this.setValue(value)
    }
  }

  is(value):boolean {
    return this.value === value;
  }
}
