import {ICustomAggregator} from "../CustomAggregator"

export interface FieldOptions {
  type:String,
  field?:String,
  options?:any
  filter?:any
  customAggregator?:ICustomAggregator
}
