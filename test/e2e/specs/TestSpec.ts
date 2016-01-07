import {Component, field} from "xenon";
import Hits from "../../../src/components/search/hits/page-objects/Hits.ts";

class SearchPage extends Component {

  @field(Hits)
  hits:Hits

}

describe("example", () => {

  beforeEach(() => {
    this.searchPage = new SearchPage();
    browser.get("http://localhost:8080/test/e2e/movie-app");
  })

  it("should show hits", () => {
    expect(this.searchPage.hits.isVisible(20000)).toBe(true);
    // browser.pause()
    expect(this.searchPage.hits.count()).toBe(10)
  })

})
