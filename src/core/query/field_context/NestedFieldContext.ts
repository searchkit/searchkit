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

  getAggregationPath(){
    return this.getCustomAggregator()
      ? this.getCustomAggregator().getAggregationPath()
      : ["inner", "filtered.aggs"];
  }

  wrapAggregations(...aggregations){
    return this.getCustomAggregator()
      ? this.getCustomAggregator().getAggregations(this, ...aggregations)
      : this.getAggregations(...aggregations);
  }

  getAggregations(...aggregations) {
    return [NestedBucket(
      "inner",
      this.fieldOptions.options.path,
      FilterBucket(
        "filtered.aggs",
        this.getContextFilter(),
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
