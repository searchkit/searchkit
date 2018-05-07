import * as PropTypes from "prop-types";
import {
  SearchkitComponent,
  SearchkitComponentProps,
  PageSizeAccessor,
  RenderComponentType,
  RenderComponentPropType,
  renderComponent
} from "../../../core"

const map = require("lodash/map")
const defaults = require("lodash/defaults")

import { Select, ListProps } from "../../ui"

export interface PageSizeSelectorProps extends SearchkitComponentProps {
  listComponent?:RenderComponentType<ListProps>
  options:Array<Number>
}

export class PageSizeSelector extends SearchkitComponent<PageSizeSelectorProps, any> {

  static defaultProps = {
    listComponent: Select
  }

  static propTypes = defaults({
    listComponent:RenderComponentPropType,
    options:PropTypes.arrayOf(
      PropTypes.number
    ).isRequired
  },SearchkitComponent.propTypes)

  getPageSizeAccessor(){
    return this.searchkit.getAccessorByType(PageSizeAccessor)
  }

  setSize(size){
    let pageSizeAccessor = this.getPageSizeAccessor()
    if(size){
      pageSizeAccessor.setSize(Number(size))
      this.searchkit.performSearch()
    }
  }

  setItems(sizes){
    this.setSize(sizes[0])
  }

  render(): React.ReactElement<any> {
    let pageSizeAccessor = this.getPageSizeAccessor()
    if(pageSizeAccessor){
      let options = map(this.props.options, (option)=> {
        return {key:option, label:option}
      })
      let selectedSize = pageSizeAccessor.getSize()
      const {mod, className} = this.props
      return renderComponent(this.props.listComponent, {
        mod, className,
        disabled: !this.hasHits(),
        items: options,
        selectedItems: [selectedSize],
        toggleItem: this.setSize.bind(this),
        setItems:this.setItems.bind(this),
        urlBuilder: (_item) => {},
        translate:this.translate
      })
    }
    return null

  }

}
