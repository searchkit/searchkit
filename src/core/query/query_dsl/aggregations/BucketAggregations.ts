const assign = require("lodash/assign")
const isEmpty = require("lodash/isEmpty")
import {AggsContainer} from "./AggsContainer"

export interface TermsBucketOptions {
  size?:number
  order?:any
  include?:Array<string> | string
  exclude?:Array<string> | string
  min_doc_count?:number
}

// Emulates the maximum value an integer can have in Java
// See: https://docs.oracle.com/javase/7/docs/api/java/lang/Integer.html#MAX_VALUE
export const DefaultNumberBuckets = Math.pow(2, 31) - 1;

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
  if (isEmpty(filter)) {
    return AggsContainer(key, {filter: {match_all:{}}}, childAggs)
  }
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

export function GeoboundsBucket(key, field, options = {}, ...childAggs) {
  return AggsContainer(key, { geo_bounds: assign({ field }, options) }, childAggs);
}

export function DateHistogramBucket(key, field, options = {}, ...childAggs) {
  return AggsContainer(key, { date_histogram: assign({ field }, options) }, childAggs);
}
