import {
  HasParentQuery
} from "../../../../../"

it("HasParentQuery", ()=> {
  expect(HasParentQuery("folder", "somequery")).toEqual({
    has_parent:{
      parent_type:"folder",
      query:"somequery"
    }
  })
  expect(HasParentQuery("folder", "somequery", {
    score_mode:"sum", invalid:true, inner_hits:{}
  })).toEqual({
    has_parent:{
      parent_type:"folder",
      query:"somequery",
      score_mode:"sum",
      inner_hits:{}
    }
  })
})
