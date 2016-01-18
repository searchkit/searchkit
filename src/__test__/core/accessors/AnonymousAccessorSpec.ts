import {
  AnonymousAccessor,
  ImmutableQuery
} from "../../../"

describe("AnonymousAccessor", ()=> {

  it("should override buildSharedQuery", ()=> {
    let accessor = new AnonymousAccessor((query)=> {
      return query.setSize(11)
    })
    let query = accessor.buildSharedQuery(new ImmutableQuery())
    expect(query.getSize()).toBe(11)
  })
})
