import {
  SourceFilterAccessor, ImmutableQuery
} from "../../../"

describe("SourceFilterAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new SourceFilterAccessor(["title.*"])
    this.query = new ImmutableQuery()
  })

  it("constructor()", ()=> {
    expect(this.accessor.source).toEqual(["title.*"])
  })

  it("buildSharedQuery()", ()=> {
    let query = this.accessor.buildSharedQuery(this.query)
    expect(query).not.toBe(this.query)
    expect(query.query._source).toEqual(["title.*"])
  })

})
