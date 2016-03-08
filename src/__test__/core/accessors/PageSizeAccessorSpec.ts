import {
  PageSizeAccessor, ImmutableQuery
} from "../../../"

describe("PageSizeAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new PageSizeAccessor(10)
    this.query = new ImmutableQuery()
  })

  it("constructor()", ()=> {
    expect(this.accessor.defaultSize).toBe(10)
    expect(this.accessor.state.getValue()).toBe(null)
  })

  it("buildSharedQuery()", ()=> {
    let query = this.accessor.buildSharedQuery(this.query)
    expect(query).not.toBe(this.query)
    expect(query.getSize()).toBe(10)
    this.accessor.setSize(20)
    query = this.accessor.buildSharedQuery(this.query)
    expect(query.getSize()).toBe(20)
  })

  it("setSize()", ()=> {
    this.accessor.setSize(20)
    expect(this.accessor.getSize()).toBe(20)
    expect(this.accessor.state.getValue()).toBe(20)
    this.accessor.setSize(10)
    expect(this.accessor.getSize()).toBe(10)
    expect(this.accessor.state.getValue()).toBe(null)
  })

})
