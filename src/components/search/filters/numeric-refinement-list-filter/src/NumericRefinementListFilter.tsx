import * as React from "react";
import * as PropTypes from "prop-types";

import {
	SearchkitManager,
	SearchkitComponent,
	NumericOptionsAccessor,
	SearchkitComponentProps,
	RangeOption,
	RenderComponentType,
	RenderComponentPropType,
	renderComponent,
	FieldOptions
} from "../../../../../core"

import {
	ListProps, ItemProps, ItemList, Panel
} from "../../../../ui"

import {defaults} from "lodash"
import {map} from "lodash"

export interface NumericRefinementListFilterProps extends SearchkitComponentProps {
  field:string
  title:string
  options:Array<RangeOption>
  id:string
  multiselect?: boolean
  showCount?: boolean
  listComponent?: RenderComponentType<ListProps>
  itemComponent?: RenderComponentType<ItemProps>
  containerComponent?: RenderComponentType<any>
	fieldOptions?:FieldOptions,
  countFormatter?:(count:number)=> number | string
}

export class NumericRefinementListFilter extends SearchkitComponent<NumericRefinementListFilterProps, any> {
  accessor:NumericOptionsAccessor

  static propTypes = defaults({
    containerComponent: RenderComponentPropType,
    listComponent: RenderComponentPropType,
    itemComponent: RenderComponentPropType,
    field:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired,
    id:PropTypes.string.isRequired,
    multiselect: PropTypes.bool,
    showCount: PropTypes.bool,
    options:PropTypes.arrayOf(
      PropTypes.shape({
        title:PropTypes.string.isRequired,
        from:PropTypes.number,
        to:PropTypes.number,
        key:PropTypes.string
      })
    ),
		fieldOptions:PropTypes.shape({
	    type:PropTypes.oneOf(["embedded", "nested", "children"]).isRequired,
	    options:PropTypes.object
	  }),
		countFormatter:PropTypes.func
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: ItemList,
    containerComponent: Panel,
    multiselect: false,
    showCount: true
  }

	constructor(props){
		super(props)
		this.toggleItem = this.toggleItem.bind(this)
		this.setItems = this.setItems.bind(this)
	}

  defineAccessor() {
    const {id, field, options, title, multiselect, fieldOptions} = this.props
    return new NumericOptionsAccessor(id, {
      id, field, options, title, multiselect, fieldOptions
    })
  }

  toggleItem(key) {
    this.accessor.toggleOption(key)
  }

	setItems(keys){
		this.accessor.setOptions(keys)
	}

  getSelectedItems() {
    const selectedOptions = this.accessor.getSelectedOrDefaultOptions() || []
    return map(selectedOptions, "title")
  }

  hasOptions(): boolean {
    return this.accessor.getBuckets().length != 0
  }

  render() {
    const {
			listComponent, containerComponent, itemComponent,
			showCount, title, id, mod, className, countFormatter
		} = this.props

  	return renderComponent(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: !this.hasOptions()
    },
    renderComponent(listComponent, {
			mod, className,
      items: this.accessor.getBuckets(),
			itemComponent,
      selectedItems: this.getSelectedItems(),
      toggleItem: this.toggleItem,
			setItems:this.setItems,
      docCount: this.accessor.getDocCount(),
      showCount,
			translate:this.translate,
			countFormatter
    }));
  }
}
