import {
  TermQuery
} from "../../../../../"

it("TermQuery", ()=> {
  expect(TermQuery("color", "red")).toEqual({
    term:{
      color:"red"
    }
  })
})
