import {FieldContext} from './FieldContext';
import {NestedBucket, NestedQuery} from "../query_dsl"
import {get} from "lodash"

export class NestedFieldContext extends FieldContext {

  constructor(fieldOptions){
    super(fieldOptions)
    if(!get(this.fieldOptions, "options.path")){
      throw new Error("fieldOptions type:nested requires options.path")
    }
  }

  getAggregationPath(){
    return "inner"
  }

  wrapAggregations(...aggregations){
    return [NestedBucket(
      "inner",
      this.fieldOptions.options.path,
      ...aggregations
    )]
  }
  wrapFilter(filter){
    return NestedQuery(
      this.fieldOptions.options.path,
      filter,
      this.fieldOptions.options
    )
  }
}
