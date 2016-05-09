import {
  PaginationAccessor, ImmutableQuery, PageSizeAccessor,
  AccessorManager
} from "../../../"


describe("PaginationAccessor", ()=> {

  beforeEach(()=> {
    this.accessor = new PaginationAccessor("p")
  })

  it("onStateChange", ()=> {
    this.accessor.state = this.accessor.state.setValue(2)

    this.accessor.onStateChange({p:1})
    expect(this.accessor.state.getValue()).toBe(2)

    //when old page number is same as current
    //we should clear the page number
    this.accessor.onStateChange({p:2})
    expect(this.accessor.state.getValue()).toBe(null)
  })

  it("buildOwnQuery", ()=> {
    let query = new ImmutableQuery().setSize(20)

    const expectStateFrom = (state, from)=> {
      this.accessor.state = this.accessor.state.setValue(state)
      query = this.accessor.buildOwnQuery(query)
      expect(query.getPage()).toBe(state || 1)
      expect(query.getFrom()).toBe(from)
    }
    expectStateFrom(null, undefined)
    expectStateFrom(1, undefined)
    expectStateFrom(2, 20)
    expectStateFrom(3, 40)
    query = query.setSize(15)
    expectStateFrom(3, 30)

  })

  it("Fix bug in conjunction with PageSizeAccessor", ()=> {
    let pagination = new PaginationAccessor("p")
   
    pagination.state = pagination.state.setValue(5)
    let pageSize = new PageSizeAccessor(100)
    let accessors = new AccessorManager()
    accessors.add(pagination)
    accessors.add(pageSize)
    let query = accessors.buildQuery()

    expect(query.getSize()).toBe(100)
    expect(query.getFrom()).toBe(400)
    expect(query.getPage()).toBe(5)
  })


})
