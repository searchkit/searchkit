export interface RangeQueryOptions {
  lt?:number
  lte?:number
  gt?:number
  gte?:number
  boost?:number
  format?:string
  time_zone?:string
}

export function RangeQuery(key, options:RangeQueryOptions) {
  return {
    range: {
      [key]:options
    }
  }
}
