import {
  PaginationAccessor, ImmutableQuery
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
      console.log(JSON.stringify(query.getJSON()))
      expect(query.getFrom()).toBe(from)
    }
    expectStateFrom(null, undefined)
    expectStateFrom(1, undefined)
    expectStateFrom(2, 20)
    expectStateFrom(3, 40)
    query = query.setSize(15)
    expectStateFrom(3, 30)

  })


})
