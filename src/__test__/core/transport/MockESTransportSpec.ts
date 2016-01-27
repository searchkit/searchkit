import {MockESTransport, ESTransport} from "../../../"
import "jasmine-ajax"


describe("MockESTransport", ()=> {

  beforeEach(()=> {
    this.transport = new MockESTransport()
  })

  it("contructed correctly", ()=> {
    expect(this.transport).toEqual(
      jasmine.any(ESTransport)
    )
  })

  it("search()", (done)=> {
    this.transport.search("query").then((returnValue)=> {
      expect(returnValue).toEqual("query")
      done()
    })

  })

})
