import {Component,  field, defaults} from "xenon";

@defaults({qa:"pagination"})
export default class Pagination extends Component {

  @field(Component,{qa:"prev"})
  prevLink: Component

  @field(Component,{qa:"next"})
  nextLink: Component
}
