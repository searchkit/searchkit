import {Utils} from "../../../"


describe("Utils", ()=> {


  it("guid()", ()=> {
    Utils.guidCounter = 0
    expect(Utils.guid()).toBe("1")
    expect(Utils.guid("prefix")).toBe("prefix2")
    expect(Utils.guid("foo")).toBe("foo3")
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

  it("computeOptionKeys", ()=> {
    let options = [
      {key:"foo"},
      {a:"a"},
      {a:"a", b:"b"},
      {}
    ]
    let computedOptions = Utils.computeOptionKeys(
      options, ["a", "b"], "all")

    expect(computedOptions).toEqual([
      {key: 'foo'},
      {a: 'a', key: 'a'},
      {a: 'a', b: 'b', key: 'a_b'},
      {key:"all"}
    ])

  })


})
