import {
  NestedQuery, NestedBucket,
  ChildrenBucket, HasChildQuery
} from "../query_dsl"

export interface FieldOptions {
  type:String,
  field?:String,
  options?:any
}

export abstract class FieldContext {
  constructor(public fieldOptions:FieldOptions){

  }
  abstract getAggregationPath():any
  abstract wrapAggregations(...aggs):Array<any>
  abstract wrapFilter(filter:any):any
}

export const FieldContextFactory = (fieldOptions)=>{
  switch (fieldOptions.type){
    case "nested":
      return new NestedFieldContext(fieldOptions)
    case "child":
      return new ChildFieldContext(fieldOptions)
    case "embedded":
    default:
      return new EmbeddedFieldContext(fieldOptions)
  }
}

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

export class ChildFieldContext extends FieldContext {

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
