import { Component, field } from "xenon"
import { ItemList } from "../../../ui/list/pageobjects"

export class FacetFilter extends ItemList {

  @field(Component, { css: ".sk-panel__header" })
  title: Component

  id(name) {
    this.css(".filter--" + name)
  }

}
