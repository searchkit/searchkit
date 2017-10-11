import * as React from "react";
import * as PropTypes from "prop-types";

import {
	SearchkitComponent,
	FastClick,
	SearchkitComponentProps,
	RenderComponentType,
	ResetSearchOptions,
	ResetSearchAccessor,
  renderComponent
} from "../../../../../core"
const defaults = require("lodash/defaults")


export interface ResetFiltersDisplayProps {
	bemBlock:any,
	hasFilters:boolean,
	resetFilters:Function,
	clearAllLabel:string,
	translate:Function
}

export class ResetFiltersDisplay extends React.PureComponent<ResetFiltersDisplayProps, any>{
	render(){
		const { bemBlock, hasFilters, resetFilters, clearAllLabel } = this.props
		return (
			<div>
				<FastClick handler={resetFilters}>
					<div className={bemBlock().state({disabled:!hasFilters})}>
						<div className={bemBlock("reset")}>{clearAllLabel}</div>
					</div>
				</FastClick>
			</div>
		)
	}
}

export interface ResetFiltersProps extends SearchkitComponentProps {
	component?: RenderComponentType<ResetFiltersDisplayProps>,
	options?:ResetSearchOptions
}

export class ResetFilters extends SearchkitComponent<ResetFiltersProps, any> {

	static translations:any = {
		"reset.clear_all":"Clear all filters"
	}
	translations = ResetFilters.translations
	accessor:ResetSearchAccessor

	static propTypes = defaults({
		translations:SearchkitComponent.translationsPropType(
			ResetFilters.translations
		),
		component:PropTypes.func,
		options:PropTypes.object
	}, SearchkitComponent.propTypes)

	static defaultProps = {
		component:ResetFiltersDisplay
	}

	constructor(props){
		super(props)
		this.resetFilters = this.resetFilters.bind(this)
	}

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "sk-reset-filters")
		}
	}

	defineAccessor(){
		return new ResetSearchAccessor(this.props.options)
	}

	resetFilters() {
		this.accessor.performReset()
		this.searchkit.performSearch()
	}

  render() {
		const props:ResetFiltersDisplayProps = {
			bemBlock:this.bemBlocks.container,
			resetFilters:this.resetFilters,
			hasFilters:this.accessor.canReset(),
			translate:this.translate,
			clearAllLabel: this.translate("reset.clear_all")
		}
		return renderComponent(this.props.component, props)
  }
}
