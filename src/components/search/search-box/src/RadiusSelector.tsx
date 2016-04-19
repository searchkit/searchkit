import * as React from "react";
import {
  SearchkitComponent,
  SearchkitComponentProps,
  RadiusAccessor,
  FastClick,
  RenderComponentType,
  RenderComponentPropType,
  renderComponent
} from "../../../../core"

const map = require("lodash/map")
const defaults = require("lodash/defaults")

import { Select, ListProps } from "../../../ui"

export interface RadiusSelectorProps extends SearchkitComponentProps {
  listComponent?:RenderComponentType<ListProps>
  options:Array<String>
}

export class RadiusSelector extends SearchkitComponent<RadiusSelectorProps, any> {

  static defaultProps = {
    listComponent: Select
  }

  static propTypes = defaults({
    listComponent:RenderComponentPropType,
    options:React.PropTypes.arrayOf(
      React.PropTypes.string
    ).isRequired
  },SearchkitComponent.propTypes)

  getRadiusAccessor(){
    return this.searchkit.getAccessorByType(RadiusAccessor)
  }

  setRadius(radius){
    let radiusAccessor = this.getRadiusAccessor()
    if(radius){
      radiusAccessor.setRadius(radius)
      this.searchkit.performSearch()
    }
  }

  setItems(radii){
    this.setRadius(radii[0])
  }

  render() {
    let radiusAccessor = this.getRadiusAccessor()
    if(radiusAccessor){
      let options = map(this.props.options, (option)=> {
        return {key:option, label:option}
      })
      let selectedRadius = radiusAccessor.getRadius()      
      const {mod, className} = this.props
      return renderComponent(this.props.listComponent, {
        mod, className,
        disabled: !this.hasHits(),
        items: options,
        selectedItems: [selectedRadius],
        toggleItem: this.setRadius.bind(this),
        setItems:this.setItems.bind(this),
        urlBuilder: (item) => {},
        translate: this.translate
      })
    }
    return null
  }
}
