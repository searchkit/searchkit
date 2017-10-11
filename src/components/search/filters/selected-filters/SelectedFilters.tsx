import * as React from "react";

import {
	SearchkitComponent,
	FastClick,
	SearchkitComponentProps,
	RenderComponentType,
	renderComponent
} from "../../../../core"

const defaults = require("lodash/defaults")
const size = require("lodash/size")
const map = require("lodash/map")

export class FilterItem extends React.PureComponent<FilterItemProps, any> {

	render(){
		let props = this.props
		return (
			<div className={props.bemBlocks.option()
				.mix(props.bemBlocks.container("item"))
				.mix(`selected-filter--${props.filterId}`)}>
				<div className={props.bemBlocks.option("name")}>{props.labelKey}: {props.labelValue}</div>
				<FastClick handler={props.removeFilter}>
					<div className={props.bemBlocks.option("remove-action")}>x</div>
				</FastClick>
			</div>
		)
	}
}

export interface FilterItemProps {
	key:string,
	bemBlocks?:any,
	filterId:string
	labelKey:string,
	labelValue:string,
	removeFilter:Function,
	translate:Function
}

export interface SelectedFiltersProps extends SearchkitComponentProps {
	itemComponent?: RenderComponentType<FilterItemProps>
}

export class SelectedFilters extends SearchkitComponent<SelectedFiltersProps, any> {

	static propTypes = defaults({
	}, SearchkitComponent.propTypes)

	static defaultProps = {
     itemComponent: FilterItem
   }

	constructor(props) {
		super(props)
		this.translate = this.translate.bind(this)
	}

	defineBEMBlocks() {
		var blockName = (this.props.mod || "sk-selected-filters")
		return {
			container: blockName,
			option:`${blockName}-option`
		}
	}

	getFilters():Array<any> {
		return this.getQuery().getSelectedFilters()
	}

	hasFilters():boolean {
		return size(this.getFilters()) > 0;
	}

	renderFilter(filter) {

		return renderComponent(this.props.itemComponent, {
			key:filter.name +'$$' + filter.value,
			bemBlocks:this.bemBlocks,
			filterId:filter.id,
			labelKey:this.translate(filter.name),
			labelValue:this.translate(filter.value),
			removeFilter:this.removeFilter.bind(this, filter),
			translate:this.translate
		})
	}

	removeFilter(filter) {
		filter.remove()
		this.searchkit.performSearch()
	}

  render() {
		if (!this.hasFilters()) {
			return null
		}
    return (
      <div className={this.bemBlocks.container()}>
				{map(this.getFilters(), this.renderFilter.bind(this))}
      </div>
    )
  }
}
