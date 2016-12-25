import {FieldContext} from './FieldContext';
import {NestedBucket, NestedQuery, FilterBucket} from "../query_dsl"
const get = require("lodash/get")

export class NestedFieldContext extends FieldContext {

  constructor(fieldOptions){
    super(fieldOptions)
    if(!get(this.fieldOptions, "options.path")){
      throw new Error("fieldOptions type:nested requires options.path")
    }
  }

  getContextFilter(){
    return get(this.fieldOptions, "options.filter", null);
  }

  getAggregationPath(){
    return ["inner", "filtered.aggs"];
  }

  wrapAggregations(...aggregations){
    return [NestedBucket(
      "inner",
      this.fieldOptions.options.path,
      FilterBucket(
        "filtered.aggs",
        this.fieldOptions.options.filter || {},
        ...aggregations
      )
    )];
  }
  wrapFilter(filter){
    return NestedQuery(
      this.fieldOptions.options.path,
      filter,
      this.fieldOptions.options
    )
  }
}
