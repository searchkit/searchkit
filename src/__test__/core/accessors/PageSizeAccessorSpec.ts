import {
  PageSizeAccessor, ImmutableQuery
} from "../../../"

describe("PageSizeAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new PageSizeAccessor(10)
    this.query = new ImmutableQuery()
  })

  it("constructor()", ()=> {
    expect(this.accessor.size).toBe(10)
  })

  it("buildSharedQuery()", ()=> {
    let query = this.accessor.buildSharedQuery(this.query)
    expect(query).not.toBe(this.query)
    expect(query.getSize()).toBe(10)
  })

})
