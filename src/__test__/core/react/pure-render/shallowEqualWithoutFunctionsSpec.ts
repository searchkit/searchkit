import {
  shallowEqualWithoutFunctions
} from "../../../../"

describe("shallowEqualWithoutFunctions", ()=> {


  it("basics test", ()=> {
    let a = {a:1}
    let b = {a:1}
    expect(shallowEqualWithoutFunctions(a,b)).toBe(true)
    expect(shallowEqualWithoutFunctions(a,{})).toBe(false)
    expect(shallowEqualWithoutFunctions(1,1)).toBe(true)
    expect(shallowEqualWithoutFunctions(1,"1")).toBe(false)
  })

  it("ignores functions", ()=> {
    let a = {a:1, fn:()=>{}}
    let b = {a:1, fn:()=>{}}
    expect(shallowEqualWithoutFunctions(a,b)).toBe(true)
  })

  it("doesn't ignore functions", ()=> {
    let a = {a:1, itemComponent:()=>{}}
    let b = {a:1, itemComponent:()=>{}}
    expect(shallowEqualWithoutFunctions(a,b)).toBe(false)

    let component = ()=> {}

    let c = {a:1, component}
    let d = {a:1, component}
    expect(shallowEqualWithoutFunctions(c,d)).toBe(true)

  })


})
