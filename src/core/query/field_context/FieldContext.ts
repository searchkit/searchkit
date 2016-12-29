import {FieldOptions} from "./FieldOptions"
import {ICustomAggregator} from "../CustomAggregator"

const get = require("lodash/get")

export abstract class FieldContext {
  customAggregator:ICustomAggregator

  constructor(public fieldOptions:FieldOptions){
    this.customAggregator = get(fieldOptions, "customAggregator", null)
  }

  getCustomAggregator() {
    return this.customAggregator;
  }

  getContextFilter(){
    return get(this.fieldOptions, "filter", {});
  }

  abstract getAggregationPath():any
  abstract wrapAggregations(...aggs):Array<any>
  abstract wrapFilter(filter:any):any
}
