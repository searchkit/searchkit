import * as React from "react"
import {
  PureRender,
  shouldPureComponentUpdate
} from "../../../../"


describe("PureRender", ()=> {

  it("should add shouldComponentUpdate", ()=> {
    @PureRender
    class MyComponent extends React.Component<any, any>{

    }
    let comp = new MyComponent()
    expect(comp["shouldComponentUpdate"]).toBe(shouldPureComponentUpdate)
  })



})
