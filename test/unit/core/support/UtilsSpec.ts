import {Utils} from "../../../../src/index.ts"

describe("Utils", ()=> {


  it("guid()", ()=> {
    expect(Utils.guid().length).toEqual(36)
  })

})
