import {
  HighlightAccessor, ImmutableQuery
} from "../../../"

describe("", ()=> {

  beforeEach(()=> {
    this.accessor = new HighlightAccessor([
      "title", "content"
    ])
  })

  it("constructor(), computeHighlightedFields()", ()=> {
    expect(this.accessor.highlightFields).toEqual({
      fields: {
        title:{},
        content: {}
      }
    })
  })

  it("buildOwnQuery()", ()=> {
    let query = this.accessor.buildOwnQuery(new ImmutableQuery())
    expect(query.query.highlight).toEqual({
      fields: {
        title:{},
        content: {}
      }
    })
  })


})
