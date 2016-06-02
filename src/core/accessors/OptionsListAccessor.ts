import {StatefulAccessor} from "./StatefulAccessor"
import {ValueState, SearchkitComponent} from "../../core"
const head = require("lodash/head")
const find = require("lodash/find")


export interface OptionItem {
  label:string
  defaultOption?:boolean
  key:string
  value:any
}

export interface OptionsListOptions {
  id:string
  accessorId:string
  accessorProp:string
  options:Array<OptionItem>
}

export class OptionsListAccessor extends StatefulAccessor<ValueState>{
  state = new ValueState()
  options:OptionsListOptions
  constructor(key, options:OptionsListOptions){
    super(key)
    this.options = options
  }

  getSelectedOption(){
    let options = this.options.options
    return find(options, {key:this.state.getValue()}) ||
           find(options, {defaultOption:true}) ||
           head(options)
  }

  beforeBuildQuery(){
    const {accessorId, accessorProp} = this.options
    let accessor = this.searchkit.accessors.statefulAccessors[accessorId]
    let option = this.getSelectedOption()
    if(accessor && option && accessor.options){
      accessor.options[accessorProp] = option.value
    } else {
      option = option || {value:undefined}
      console.warn(`Could not set accessor option accessorId:${accessorId}, accessorProp:${accessorProp} with value ${option.value}`)
    }
  }

  selectOption(key){
    let option = find(this.options.options, {key})
    if(option) {
      if(option.defaultOption){
        this.state = this.state.clear()
      } else {
        this.state = this.state.setValue(option.key)
      }
      this.search()
    }
  }

  search() {
    this.searchkit.performSearch()
  }
}
