import * as React from "react";

import {
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick,
	SearchkitComponentProps,
	ReactComponentType,
	PureRender,
	ResetSearchOptions,
	ResetSearchAccessor,
  renderComponent
} from "../../../../../core"
import {defaults} from "lodash"


export interface ResetFiltersDisplayProps {
	bemBlock:any,
	hasFilters:boolean,
	resetFilters:Function,
	clearAllLabel:string,
	translate:Function
}

@PureRender
export class ResetFiltersDisplay extends React.Component<ResetFiltersDisplayProps, any>{
	render(){
		const {bemBlock, hasFilters, translate, resetFilters, clearAllLabel} = this.props
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
	component?:ReactComponentType<ResetFiltersDisplayProps>,
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
		component:React.PropTypes.func,
		options:React.PropTypes.object
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
