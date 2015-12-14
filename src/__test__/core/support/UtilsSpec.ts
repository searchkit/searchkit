import {Utils} from "../../../"

describe("Utils", ()=> {


  it("guid()", ()=> {
    expect(Utils.guid().length).toEqual(36)
  })

})
