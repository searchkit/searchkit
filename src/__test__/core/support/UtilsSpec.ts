import {Utils} from "../../../../src"

describe("Utils", ()=> {


  it("guid()", ()=> {
    expect(Utils.guid().length).toEqual(36)
  })

})
