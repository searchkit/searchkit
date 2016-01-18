import {AggsContainer} from "./AggsContainer"

export function AvgBucketPipeline(key, buckets_path){
  return AggsContainer(key, {buckets_path})
}
