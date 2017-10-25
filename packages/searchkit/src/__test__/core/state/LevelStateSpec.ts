import {LevelState} from "../../../";

describe("LevelState", ()=> {
  beforeEach(()=> {
    this.initialState = [["a"], ["b"]]
    this.state = new LevelState(this.initialState)
  })

  afterEach(()=> {
    //test immutability
    expect(this.state.value)
      .toEqual([["a"], ["b"]])
  })

  it("getValue()", ()=> {
    expect(this.state.getValue()).toEqual(this.initialState)
    expect(this.state.create(null).getValue()).toEqual([])
  })

  it("add()", ()=> {
    expect(this.state.add(2, "c").getValue())
      .toEqual([["a"],["b"],["c"]])
      expect(this.state.add(1, "c").getValue())
        .toEqual([["a"],["b", "c"]])
  })

  it("contains()", ()=> {
    expect(this.state.contains(1,"b")).toEqual(true)
    expect(this.state.contains(1,"c")).toEqual(false)
  })

  it("clear()", ()=> {
    const state = this.state.create([['a'],['b'],['c']])
    expect(state.clear().getValue()).toEqual([])
    expect(state.clear(0).getValue()).toEqual([])
    expect(state.clear(1).getValue()).toEqual([['a']])
    expect(state.clear(2).getValue()).toEqual([['a'],['b']])
    expect(state.clear(3).getValue()).toEqual([['a'],['b'], ['c']])
  })

  it("remove()", ()=> {
    const state = new LevelState([
      ['a','b'], ['c', 'd']
    ])
    expect(state.remove(0,'a').getValue()).toEqual([
      ['b'], ['c', 'd']
    ])
    expect(state.remove(1,'d').getValue()).toEqual([
      ['a','b'], ['c']
    ])
    expect(state.remove(0,'c').getValue()).toEqual([
      ['a','b'], ['c', 'd']
    ])
  })

  it("toggle()", ()=> {
    expect(this.state.toggle(0,'c').getValue()).toEqual([
      ['a','c'], ['b']
    ])
    expect(this.state.toggle(0,'a').getValue()).toEqual([
      [], ['b']
    ])
  })

  it("getLevel()", ()=> {
    expect(this.state.getLevel(0)).toEqual(['a'])
    expect(this.state.getLevel(1)).toEqual(['b'])
    expect(this.state.getLevel(2)).toEqual([])

  })

  it("levelHasFilters()", ()=> {
    expect(this.state.levelHasFilters(0)).toEqual(true)
    expect(this.state.levelHasFilters(2)).toEqual(false)
  })

  it("isLeafLevel()", ()=> {
    expect(this.state.isLeafLevel(0)).toEqual(false)
    expect(this.state.isLeafLevel(2)).toEqual(false)
    expect(this.state.isLeafLevel(1)).toEqual(true)
  })

  it("getLeafLevel()", ()=> {
    expect(this.state.getLeafLevel()).toEqual(1)
    expect(this.state.add(2,'c').getLeafLevel())
      .toEqual(2)
    expect(this.state.remove(0,'a').getLeafLevel())
      .toEqual(1)
  })

  it("toggleLevel()", ()=> {
    const state = new LevelState([
      ['a'],['b'], ['c']
    ])

    expect(state.toggleLevel(2,'c').getValue())
      .toEqual([['a'], ['b']])
    expect(state.toggleLevel(1,'b').getValue())
      .toEqual([['a'], ['b']])
    expect(state.toggleLevel(2,'d').getValue())
      .toEqual([['a'], ['b'], ['d']])
    expect(state.toggleLevel(1,'d').getValue())
      .toEqual([['a'], ['d']])
    expect(state.toggleLevel(0,'a').getValue())
      .toEqual([['a']])
    expect(state.toggleLevel(0,'d').getValue())
      .toEqual([['d']])
        })
})
