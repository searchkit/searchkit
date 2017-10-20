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

  it("should handle null fn", ()=> {
    let accessor = new AnonymousAccessor(null)
    let query = new ImmutableQuery()
    expect(accessor.buildSharedQuery(query)).toBe(query)
  })
})
