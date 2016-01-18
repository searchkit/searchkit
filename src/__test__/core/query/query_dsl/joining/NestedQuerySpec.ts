import {
  NestedQuery
} from "../../../../../"

it("NestedQuery", ()=> {
  expect(NestedQuery("taxonomy", "somequery")).toEqual({
    nested:{
      path:"taxonomy",
      filter:"somequery"
    }
  })
})
