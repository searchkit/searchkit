import {Component,  field, defaults, List} from "xenon";
import RefinementOption from "./RefinementOption.ts";

export default class RefinementListFilter extends Component {

  @field(Component, {qa:"header"})
  title: Component

  @field(List, {qa:"options", itemQA:"option", itemType:RefinementOption})
  options:List<RefinementOption>

  id(name) {
    this.qa("filter--"+name)
  }

}
