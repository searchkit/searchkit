import {Utils} from "../../../"


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

  it("interpolate", ()=> {
    expect(Utils.interpolate("hello {message}, Hello {message}{ending}{missing}", {
      message:"World",
      ending:"!"
    })).toEqual("hello World, Hello World!{missing}")
  })

  it("translate() - don't call interpolate", ()=> {
    let key = "No Results found!"
    spyOn(Utils, "interpolate")
    expect(Utils.translate(key)).toBe(key)
    expect(Utils.interpolate).not.toHaveBeenCalled()
  })

  it("translate() - with interpolations", ()=> {
    let key = "{count} Results found!"
    spyOn(Utils, "interpolate").and.callThrough()
    expect(Utils.translate(key, {count:5})).toBe(
      "5 Results found!"
    )
    expect(Utils.interpolate).toHaveBeenCalledWith(
      key, {count:5}
    )
  })

  it("autobind()", ()=> {
    class Foo {
      message="hello"

      @Utils.autobind
      getMessage(something){
        return this.message + " " + something
      }
    }

    let fn = new Foo().getMessage
    expect(fn("world")).toBe("hello world")

  })
})
