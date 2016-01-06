import {Component, Input, Button, field, defaults} from "xenon";
import Loader from "./Loader";

export default class SearchBox extends Component {

  @field(Input, {qa:"query"})
  query: Input

  @field(Button, {qa:"submit"})
  submit: Button

  @field(Loader)
  loader: Loader

  search(query:string) {
    this.query.type(query);
    this.submit.click();
  }
}
