import {
  NestedQuery
} from "../../../../../"

it("NestedQuery", ()=> {
  expect(NestedQuery("taxonomy", "somequery")).toEqual({
    nested:{
      path:"taxonomy",
      query:"somequery"
    }
  })

  expect(NestedQuery("taxonomy", "somequery", {score_mode:"sum", invalid:"foo", inner_hits:{}})).toEqual({
    nested:{
      path:"taxonomy",
      query:"somequery",
      score_mode:"sum",
      inner_hits:{}
    }
  })
})
