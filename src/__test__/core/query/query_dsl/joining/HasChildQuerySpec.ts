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
  expect(HasChildQuery("tags", "somequery", {
    score_mode:"sum", invalid:true, inner_hits:{},
    max_children:10, min_children:1
  })).toEqual({
    has_child:{
      type:"tags",
      query:"somequery",
      score_mode:"sum",
      inner_hits:{},
      max_children:10,
      min_children:1
    }
  })

})
