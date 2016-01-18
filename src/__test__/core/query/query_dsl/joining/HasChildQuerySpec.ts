import {
  HasChildQuery
} from "../../../../../"

it("HasChildQuery", ()=> {
  expect(HasChildQuery("tags", "somequery")).toEqual({
    has_child:{
      type:"tags",
      query:"somequery"
    }
  })
})
