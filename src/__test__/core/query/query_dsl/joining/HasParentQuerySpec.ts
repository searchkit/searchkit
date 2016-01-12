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
})
