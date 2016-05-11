import {FieldContext} from './FieldContext';
import {ChildrenBucket, HasChildQuery} from "../query_dsl"

export class ChildrenFieldContext extends FieldContext {

  getAggregationPath(){
    return "inner"
  }
  wrapAggregations(...aggregations){
    return [ChildrenBucket(
      "inner",
      this.fieldOptions.options.childType,
      ...aggregations
    )]
  }
  wrapFilter(filter){
    return HasChildQuery(this.fieldOptions.options.childType, filter)
  }
}
