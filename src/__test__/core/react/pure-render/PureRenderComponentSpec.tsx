import {
  PureRenderComponent,
  shouldPureComponentUpdate
} from "../../../../"


describe("PureRenderComponent", ()=> {

  it("should inherit shouldPureComponentUpdate", ()=> {
    class MyComponent extends PureRenderComponent<any>{

    }
    let comp = new MyComponent()
    expect(comp.shouldComponentUpdate).toBe(shouldPureComponentUpdate)

    comp.props = {p:1}
    comp.state= {s:1}
    expect(comp.shouldComponentUpdate({p:1}, {s:1})).toBe(false)
    expect(comp.shouldComponentUpdate({p:2}, {s:1})).toBe(true)
  })



})
