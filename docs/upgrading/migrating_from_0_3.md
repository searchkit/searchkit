# Migrating from Searchkit 0.3.x

## Searchkit now uses lodash 4.0
The api is identical, but if you get terminal errors during development
you might need to do a clean npm install.

## RangeQuery api changed

```tsx
  import {RangeQuery} from "searchkit"

  //before
  RangeQuery("price", 10, 21)

  //after
  RangeQuery("price", {
    gte:10, lt:21
  })
```

The new RangeQuery api now allows the following options
```typescript
export interface RangeQueryOptions {
  lt?:number
  lte?:number
  gt?:number
  gte?:number
  boost?:number
  format?:string
  time_zone?:string
}
```
