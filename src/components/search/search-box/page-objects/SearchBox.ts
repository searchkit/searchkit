import {Component, field, defaults} from "xenon";
import Loader from "./Loader";

export default class SearchBox extends Component {

  @field(Component, {qa:"query"})
  query: Component

  @field(Component, {qa:"submit"})
  submit: Component

  @field(Loader)
  loader: Loader

  search(query:string) {
    this.query.type(query)
    expect(this.loader.isNotVisible()).toBe(true)
  }
}
