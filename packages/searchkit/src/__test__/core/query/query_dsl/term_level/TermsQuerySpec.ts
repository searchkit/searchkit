import {
  TermsQuery
} from "../../../../../"

it("TermsQuery", ()=> {
  expect(TermsQuery("color", ["red", "blue"])).toEqual({
    terms:{
      color:["red", "blue"]
    }
  })
})
