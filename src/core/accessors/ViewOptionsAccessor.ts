const map = require("lodash/map")
const head = require("lodash/head")
const find = require("lodash/find")
const omit = require("lodash/omit")

import {StatefulAccessor} from "./StatefulAccessor"
import {ValueState, SearchkitComponent} from "../../core"

export class ViewOptionsAccessor extends StatefulAccessor<ValueState>{
  state = new ValueState()
  options:Array<any>
  constructor(key, options){
    super(key)
    this.options = options
  }

  getSelectedOption(){
    return find(this.options, {key:this.state.getValue()}) ||
           find(this.options, {defaultOption:true}) ||
           head(this.options)
  }
}
