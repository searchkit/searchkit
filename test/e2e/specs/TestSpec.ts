import {Component, field} from "xenon";
import Hits from "../../../src/components/search/hits";

class SearchPage extends Component {

  @field(Hits)
  hits:Hits

}

describe("example", () => {

  beforeEach(() => {
    searchPage = new SearchPage();
    browser.get("http://localhost:3000");
  })

  it("should show hits", () => {
    expect(searchPage.hits.isVisible(20000)).toBe(true);
  })

})
