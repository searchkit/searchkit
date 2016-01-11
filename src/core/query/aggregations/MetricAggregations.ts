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
