import {
  OptionsListAccessor, StatefulAccessor,
  SearchkitManager, ValueState
} from "../../../"

class ExampleAccessor extends StatefulAccessor<any> {
  options:Object
  constructor(key, options){
    super(key)
    this.options = options
  }
}

describe("OptionsListAccessor", ()=> {

  beforeEach(()=> {
    this.itemA = {label:"A", key:"a", value:2}
    this.itemB = {label:"B", key:"b", value:4, defaultOption:true}
    this.itemC = {label:"C", key:"c", value:6}

    this.optionItems = [
      this.itemA,this.itemB, this.itemC
    ]

    this.options = {
      id:"optionList",
      accessorId:"example",
      accessorProp:"foo",
      options:this.optionItems
    }

    this.searchkit = SearchkitManager.mock()
    this.searchkit.setResults({
      hits:{
        total:2,
        hits:[
          {_id:"1"},
          {_id:"2"}
        ]
      }
    })
    this.accessor = new OptionsListAccessor("o", this.options)
    this.exampleAccessor = new ExampleAccessor("example", {})
    this.searchkit.addAccessor(this.accessor)
    this.searchkit.addAccessor(this.exampleAccessor)

  })

  it("should be constructed correctly", ()=> {
    expect(this.accessor.key).toBe("o")
    expect(this.accessor.options).toBe(this.options)
  })

  it("getSelectedOption()", ()=> {
    expect(this.accessor.getSelectedOption())
      .toBe(this.itemB)
    this.accessor.state = new ValueState("c")
    expect(this.accessor.getSelectedOption())
      .toBe(this.itemC)
    this.accessor.state = this.accessor.state.clear()
    this.itemB.defaultOption = false
    expect(this.accessor.getSelectedOption())
      .toBe(this.itemA)
  })

  it("beforeBuildQuery()", ()=> {
    this.accessor.beforeBuildQuery()
    expect(this.exampleAccessor.options)
      .toEqual({ foo:4 })
  })

  it("beforeBuildQuery() - with missing information", ()=> {
    spyOn(console, "warn")
    this.accessor.options.accessorId = "missing"
    this.accessor.beforeBuildQuery()
    expect(console.warn).toHaveBeenCalledWith(
      "Could not set accessor option accessorId:missing, accessorProp:foo with value 4"
    )
  })

  describe("selectOption(), search()", ()=> {

    beforeEach(()=> {
      spyOn(this.searchkit, "performSearch")
    })

    it("missing key", ()=> {
      this.accessor.selectOption("d")
      expect(this.accessor.state.getValue()).toBe(null)
      expect(this.searchkit.performSearch)
        .not.toHaveBeenCalled()
    })

    it("default option", ()=> {
      this.accessor.selectOption("b")
      expect(this.accessor.state.getValue()).toBe(null)
      expect(this.searchkit.performSearch)
        .toHaveBeenCalled()
    })

    it("new option", ()=> {
      this.accessor.selectOption("a")
      expect(this.accessor.state.getValue()).toBe("a")
      expect(this.searchkit.performSearch)
        .toHaveBeenCalled()
    })


  })

})
