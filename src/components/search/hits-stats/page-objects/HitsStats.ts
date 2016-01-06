import {Component, Input, Button, field, defaults} from "xenon";

@defaults({qa:"pagination"})
export default class HitsStats extends Component {

  @field(Component,{qa:"prev"})
  prevLink: Component

  @field(Component,{qa:"next"})
  nextLink: Component
}
