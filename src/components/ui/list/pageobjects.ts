import {Component,  field, defaults, List} from "xenon";

export class ItemComponent extends Component {
  @field(Component, {qa:"checkbox"})
  checkbox:Component

  @field(Component, {qa:"label"})
  label:Component

  @field(Component, {qa:"count"})
  count:Component
}

export class ItemList extends Component {
  
  @field(List, {qa:"options", itemQA:"option", itemType:ItemComponent})
  options:List<ItemComponent>

}
