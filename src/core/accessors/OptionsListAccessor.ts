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

  beforeBuildQuery(){
    let accessor = this.searchkit.accessors.statefulAccessors[this.options.accessorId]
    console.log(accessor, this.options, this.searchkit.accessors.statefulAccessors)
    if(accessor){
      let option = this.getSelectedOption()
      console.log(option)
      accessor.options[this.options.accessorProp] = option.value
      console.log(accessor.options, option.value)
    }
  }

  getSelectedOption(){
    let options = this.options.options
    return find(options, {key:this.state.getValue()}) ||
           find(options, {defaultOption:true}) ||
           head(options)
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
