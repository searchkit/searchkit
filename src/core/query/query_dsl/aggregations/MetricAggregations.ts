import {AggsContainer} from "./AggsContainer"

export function CardinalityMetric(key, field) {
  return AggsContainer(key, {
    cardinality: {field}
  })
}

export function MinMetric(key, field) {
  return AggsContainer(key, {
    min: {field}
  })
}

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
