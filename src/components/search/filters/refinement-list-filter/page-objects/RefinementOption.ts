import {Component,  field, defaults} from "xenon";

export default class RefinementOption extends Component {

  @field(Component, {qa:"checkbox"})
  checkbox:Component

  @field(Component, {qa:"label"})
  label:Component

  @field(Component, {qa:"count"})
  count:Component

}
