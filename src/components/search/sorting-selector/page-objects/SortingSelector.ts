import {Component, Input, Button, field, defaults} from "xenon";
import Loader from "./Loader";

export class SortingSelector extends Component {

  @field(Input, {qa:"query"})
  query: Input

  @field(Button, {qa:"submit"})
  submit: Button

  search(query:string) {
    this.query.type(query);
    this.submit.click();
  }
}
