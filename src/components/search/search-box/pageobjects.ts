import {Component, field, defaults} from "xenon";

@defaults({qa:"loader", states:SearchLoader.states})
export class SearchLoader extends Component {
  public static states = {
    HIDDEN: "is-hidden"
  }
}

export class Searchbox extends Component {

  @field(Component, {qa:"query"})
  query: Component

  @field(Component, {qa:"submit"})
  submit: Component

  @field(SearchLoader)
  loader: SearchLoader

  search(query:string) {
    this.query.type(query)
    expect(this.loader.isNotVisible()).toBe(true)
  }
}
