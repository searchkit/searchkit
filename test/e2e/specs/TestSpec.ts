import {Component, field, defaults} from "xenon";
import Hits from "../../../src/components/search/hits/page-objects/Hits.ts";
import Searchbox from "../../../src/components/search/search-box/page-objects/SearchBox.ts";

class Hit extends Component {

  @field(Component, {qa:"title"})
  title:Component

}

@defaults({qa:"hits", itemQA:"hit", itemType:Hit})
class MovieHits extends Hits {

}

class SearchPage extends Component {

  @field(MovieHits)
  hits:MovieHits

  @field(Searchbox)
  searchbox:Searchbox



}

describe("example", () => {

  beforeEach(() => {
    this.searchPage = new SearchPage();
    browser.get("http://localhost:8080/test/e2e/movie-app");
  })

  it("should show hits", () => {
    expect(this.searchPage.hits.isVisible(20000)).toBe(true);
    expect(this.searchPage.hits.count()).toBe(10)
  })

  it("should find matrix", () => {
    this.searchPage.searchbox.query.type("matrix")
    expect(this.searchPage.hits.get(0).isVisible()).toBe(true)
    expect(this.searchPage.hits.get(0).title.getText()).toBe("The Matrix")
    expect(this.searchPage.hits.count()).toBe(3)
  })

})
