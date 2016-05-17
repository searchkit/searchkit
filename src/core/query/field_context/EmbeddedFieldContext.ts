import {FieldContext} from "./FieldContext"

export class EmbeddedFieldContext extends FieldContext {

  getAggregationPath(){
    return undefined
  }

  wrapAggregations(...aggregations){
    return aggregations
  }
  wrapFilter(filter){
    return filter
  }
}
