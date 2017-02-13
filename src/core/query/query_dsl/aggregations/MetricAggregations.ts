import {AggsContainer} from "./AggsContainer"
import {assign} from "lodash"

export function FieldMetricFactory(metricOp){
  return (key, field)=> {
    return AggsContainer(key, {
      [metricOp]:{field}
    })
  }
}

export const CardinalityMetric = FieldMetricFactory("cardinality")
export const MinMetric = FieldMetricFactory("min")
export const MaxMetric = FieldMetricFactory("max")
export const AvgMetric = FieldMetricFactory("avg")
export const SumMetric = FieldMetricFactory("sum")
export const StatsMetric = FieldMetricFactory("stats")

export interface TopHitsMetricOptions{
  size:number
  from?:number
  _source?:any
  sort?:any
  [prop:string]:any
}

export function TopHitsMetric(key, top_hits:TopHitsMetricOptions){
  return AggsContainer(key,{top_hits})
}

export function GeoBoundsMetric(key, field, options={}){
  return AggsContainer(key, {geo_bounds:assign({field}, options)})
}
