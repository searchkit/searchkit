import {
  SearchkitComponent,
  SearchkitManager,
  Accessor,
  ImmutableQuery
} from "../../../"
var block = require('bem-cn');


describe("SearchkitComponent", ()=> {

  beforeEach(()=> {
    this.component = new SearchkitComponent()
    this.component.props = {}
    this.component.context = {}
  })

  it("SearchkitComponent.translatePropType", ()=> {
    let translations = {
      continueButton:"Continue",
      cancelButton:"Cancel"
    }

    let handler = SearchkitComponent
      .translationsPropType(translations)

    expect(handler(
      {translations:{
        continueButton:"Continue..."
      }},
      "translations", "MyComponent"
    )).toEqual(null)

    expect(handler(
      {translations:{
        unknown1:"",
        unknown2:""
      }},
      "translations", "MyComponent"
    )).toEqual(new Error(
      "MyComponent: incorrect translations, unknown1,unknown2 keys are not included in continueButton,cancelButton"
    ))


  })

  it("translate()", ()=> {
    let searchkit = SearchkitManager.mock()
    searchkit.translateFunction = (key)=> {
      return {"searchkit":"searchkit level"}[key]
    }
    this.component.searchkit = searchkit
    this.component.props = {
      translations:{
        "prop":"prop level"
      }
    }
    this.component.translations = {
      "component":"component level {interpolation}"
    }
    expect(this.component.translate("searchkit"))
      .toEqual("searchkit level")
    expect(this.component.translate("prop"))
      .toEqual("prop level")
    expect(this.component.translate("component", {
      interpolation:"foo"
    })).toEqual("component level foo")
    expect(this.component.translate("missing key"))
      .toEqual("missing key")
  })

  it("_computeBemBlocks()", ()=> {
    expect(this.component._computeBemBlocks())
      .toEqual({})

    this.component.defineBEMBlocks = ()=> {
      let block = "hits"
      return {
  			container: block,
  			item: `${block}-hit`
  		}
    }

    expect(this.component._computeBemBlocks().container().toString())
      .toBe("hits")
    expect(this.component._computeBemBlocks().container("loading").toString())
      .toBe("hits__loading")
  })

  it("_getSearchkit()", ()=> {
    expect(this.component._getSearchkit()).toBe(undefined)
    this.component.context.searchkit ="searchkit_via_context"

    expect(this.component._getSearchkit())
      .toBe("searchkit_via_context")

    this.component.props.searchkit ="searchkit_via_props"
    expect(this.component._getSearchkit())
      .toBe("searchkit_via_props")
  })

  it("componentWillMount()", ()=> {
    spyOn(this.component, "forceUpdate")
    let searchkit = SearchkitManager.mock()
    this.component._computeBemBlocks = ()=> "computedBemBlocks"
    let accessor = new Accessor()
    this.component.defineAccessor = ()=> accessor
    spyOn(console, "warn")
    this.component.componentWillMount()
    expect(this.component.bemBlocks).toBe("computedBemBlocks")
    expect(this.component.searchkit).toBe(undefined)
    expect(this.component.accessor).toBe(undefined)
    expect(console.warn).toHaveBeenCalledWith(
      'No searchkit found in props or context for SearchkitComponent'
    )

    this.component.props = {searchkit}
    this.component.componentWillMount()
    expect(this.component.searchkit).toBe(searchkit)
    expect(this.component.accessor).toBe(accessor)
    expect(searchkit.accessors.accessors)
      .toEqual([accessor])
    expect(this.component.forceUpdate).not.toHaveBeenCalled()
    searchkit.emitter.trigger()
    expect(this.component.forceUpdate).toHaveBeenCalled()

    expect(searchkit.emitter.listeners.length).toBe(1)
    this.component.componentWillUnmount()
    expect(searchkit.emitter.listeners.length).toBe(0)

  })

  describe("getters", ()=> {

    beforeEach(()=> {
      this.searchkit = SearchkitManager.mock()
      this.results = {
        hits:{
          hits:[1,2,3],
          total:3
        }
      }
      this.searchkit.setResults(this.results)
      this.query = new ImmutableQuery().setSize(10)
      this.searchkit.query = this.query
      this.component.searchkit = this.searchkit
    })

    it("getResults()", ()=> {
      expect(this.component.getResults()).toBe(this.results)
    })

    it("getHits()", ()=> {
      expect(this.component.getHits()).toEqual([1,2,3])
    })

    it("getHitsCount()", ()=> {
      expect(this.component.getHitsCount()).toEqual(3)
    })

    it("hasHits()", ()=> {
      expect(this.component.hasHits()).toBe(true)
    })

    it("getQuery()", ()=> {
      expect(this.component.getQuery()).toBe(this.query)
    })

    it("isInitialLoading()", ()=> {
      expect(this.component.isInitialLoading()).toBe(false)
    })

    it("isLoading()", ()=> {
      expect(this.component.isLoading()).toBe(false)
    })

    it("getError()", ()=> {
      expect(this.component.getError()).toBe(null)
    })

  })

})
