import {FieldContext} from './FieldContext';
import {NestedBucket, NestedQuery} from "../query_dsl"

export class NestedFieldContext extends FieldContext {

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
    return NestedQuery(this.fieldOptions.options.path, filter)
  }
}
