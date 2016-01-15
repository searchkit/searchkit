import {Utils} from "../../../"
import * as _ from "lodash"

describe("Utils", ()=> {


  it("guid()", ()=> {
    expect(Utils.guid().length).toEqual(36)
  })

  it("collapse()", ()=> {
    let times2 = n => n*2
    expect(
      Utils.collapse([times2, times2, times2], 1)
    ).toBe(8)
  })

  it("instanceOf", ()=> {
    let isRegex = Utils.instanceOf(RegExp)
    expect(isRegex(/s/)).toBe(true)
    expect(isRegex("s")).toBe(false)
  })

})
