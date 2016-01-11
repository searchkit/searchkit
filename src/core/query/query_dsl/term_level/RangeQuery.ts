export function RangeQuery(key, from, to) {
  return {
    range: {
      [key]:{
        gte:from,
        lt:to
      }
    }
  }
}
