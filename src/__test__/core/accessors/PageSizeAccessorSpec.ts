import {
  PageSizeAccessor, ImmutableQuery
} from "../../../"

describe("PageSizeAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new PageSizeAccessor("s", 10)
    this.query = new ImmutableQuery()
  })

  it("constructor()", ()=> {
    expect(this.accessor.size).toBe(10)
  })

  it("buildOwnQuery()", ()=> {
    let query = this.accessor.buildOwnQuery(this.query)
    expect(query).not.toBe(this.query)
    expect(query.getSize()).toBe(10)
  })

})
