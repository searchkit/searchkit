import * as _ from "lodash"

import {AggsContainer} from "./AggsContainer"

export interface TermsBucketOptions {
  size?:number
}
export function TermsBucket(key, field, options:TermsBucketOptions={}, ...childAggs){
  return AggsContainer(key, {
    terms:_.extend({field}, options)
  }, childAggs)
}

export function RangeBucket(key, field, ranges, ...childAggs){
  return AggsContainer(key, {
    range:{
      field, ranges
    }
  }, childAggs)
}

export function ChildrenBucket(key, type, ...childAggs){
  return AggsContainer(key, {children:{type}}, childAggs)
}

export function FilterBucket(key, filter, ...childAggs){
  return AggsContainer(key, {filter}, childAggs)
}

export function NestedBucket(key, path, ...childAggs){
  return AggsContainer(key, {nested:{path}}, childAggs)
}
