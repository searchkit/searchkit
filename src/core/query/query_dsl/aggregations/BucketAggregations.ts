import {assign} from "lodash"
import {AggsContainer} from "./AggsContainer"

export interface TermsBucketOptions {
  size?:number
  order?:any
  include?:Array<string> | string
  exclude?:Array<string> | string
  min_doc_count?:number
}

export function TermsBucket(key, field, options:TermsBucketOptions={}, ...childAggs){
  return AggsContainer(key, {
    terms:assign({field}, options)
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

export function SignificantTermsBucket(key, field, options={}, ...childAggs){
  return AggsContainer(key, {significant_terms:assign({field}, options)}, childAggs)
}

export function GeohashBucket(key, field, options, ...childAggs){
  return AggsContainer(key, {geohash_grid:assign({field}, options)}, childAggs)
}

export function HistogramBucket(key, field, options={}, ...childAggs){
  return AggsContainer(key, {histogram:assign({field}, options)}, childAggs)
}
