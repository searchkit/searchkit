import {
  CustomHighlightAccessor, ImmutableQuery
} from "../../../"

describe("CustomHighlightAccessor", () => {

  beforeEach(() => {
    this.accessor = new CustomHighlightAccessor({})
  })

  it("constructor(), computeHighlightedFields()", () => {
    expect(this.accessor.highlightRequest).toEqual({})
  })

  it("buildOwnQuery()", () => {
    let query = this.accessor.buildOwnQuery(new ImmutableQuery())
    expect(query.query.highlight).toEqual({})
  })
})
