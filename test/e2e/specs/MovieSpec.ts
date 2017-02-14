import {Component, field, defaults, List} from "xenon"
import {
  Searchbox, FacetFilter, HitsStats
}from "../../../src/components/pageobjects"

import {browser} from 'protractor'

class Hit extends Component {

  @field(Component, {qa:"title"})
  title:Component

}

@defaults({qa:"hits", itemQA:"hit", itemType:Hit})
class MovieHits extends List<Hit> {

}

class SearchPage extends Component {

  @field(MovieHits)
  hits:MovieHits

  @field(Searchbox)
  searchbox:Searchbox

  @field(HitsStats)
  hitStats:HitsStats

  @field(FacetFilter, {id:"actors"})
  actorsFilter:FacetFilter
}

var searchPage:SearchPage = null;

describe("example", () => {

  beforeEach(() => {
    searchPage = new SearchPage()
    browser.get("http://localhost:4000/movie-app");
  })

  it("should show hits", () => {
    expect(searchPage.hits.isVisible(20000)).toBe(true);
    expect(searchPage.hits.count()).toBe(12)
  })

  it("should find matrix", () => {
    searchPage.searchbox.search("matrix")
    expect(searchPage.hits.get(0).isVisible()).toBe(true)
    expect(searchPage.hits.get(0).title.getText()).toBe("The Matrix")
    expect(searchPage.hits.count()).toBe(3)
    expect(searchPage.hitStats.info.getText()).toBe("3 results found")
  })

  it("should refine actors", () => {
    expect(searchPage.actorsFilter.isVisible()).toBe(true)
    var firstOption = searchPage.actorsFilter.options.get(0);
    expect(searchPage.actorsFilter.options.count()).toBe(10)
    expect(firstOption.label.getText()).toBe("Naveen Andrews")
    browser.executeScript("window.scrollTo(0,0)")
    firstOption.click()

    expect(searchPage.searchbox.loader.isNotVisible()).toBe(true)

    var firstHit = searchPage.hits.get(0)
    expect(firstHit.isVisible()).toBe(true)
    expect(firstHit.title.getText()).toBe("Lost")

    var secondOption = searchPage.actorsFilter.options.get(1);
    expect(secondOption.label.getText()).toBe("Emilie de Ravin")
    secondOption.click()
    expect(searchPage.searchbox.loader.isNotVisible()).toBe(true)
    firstHit = searchPage.hits.get(0)
    expect(firstHit.isVisible()).toBe(true)
    expect(firstHit.title.getText()).toBe("Do No Harm")

    searchPage.actorsFilter.options.get(0).click()
    expect(searchPage.searchbox.loader.isNotVisible()).toBe(true)
    firstHit = searchPage.hits.get(0)
    expect(firstHit.title.getText()).toBe("Lost")
    expect(searchPage.hitStats.info.getText()).toBe("73 results found")
  })

})
