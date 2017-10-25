import {
  block
} from "../../../"

describe("block", ()=> {

  it("block test", ()=> {
    let b = block("foo")
    // console.log(typeof b)
    // console.log(b.toString())
    // console.log(b.mix("bar").state({hover:true}).toString())
    let bemBlocks = {
      item:block("item"),
      container:block("container")
    }

    expect(bemBlocks.container.el("panel").mix("red").state({active:true}).toString())
      .toEqual("container__panel red is-active")

    expect(bemBlocks.container.el("panel").mix(bemBlocks.item.el().mod({mod:"yes"})).state({active:true}).toString())
      .toEqual("container__panel item item_mod_yes is-active")

    expect(bemBlocks.container.mod({type:"text"}).mix("red").state({active:true}).toString())
      .toEqual("container container_type_text red is-active")

    expect(block("button").el("icon").mod({name:"check"}).toString())
      .toEqual("button__icon button__icon_name_check")

    expect(block("button").el().mod({name:"check"}).toString())
      .toEqual("button button_name_check")


    expect(block("button").el().mix(["foo", "bar"]).toString())
      .toEqual("button foo bar")

  })

})
