import {
  RangeQuery
} from "../../../../../"

it("RangeQuery", ()=> {
  expect(RangeQuery("prices", {gte:0, lt:10})).toEqual({
    range:{
      prices:{
        gte:0, lt:10
      }
    }
  })
})
