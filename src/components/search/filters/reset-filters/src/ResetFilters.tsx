import * as React from "react";
import "../styles/index.scss";

import {
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick,
	SearchkitComponentProps,
	ReactComponentType
} from "../../../../../core"
const defaults = require("lodash/defaults")
const shallowEqual = require('react-pure-render/shallowEqual')


export interface ResetFiltersDisplayProps {
	bemBlock:any,
	hasFilters:boolean,
	resetFilters:Function,
	translate:Function
}

export class ResetFiltersDisplay extends React.Component<ResetFiltersDisplayProps, any>{
	// shouldComponentUpdate = shouldPureComponentUpdate
	shouldComponentUpdate(nextProps){
		// console.log(this, newProps)
		return shallowEqual(this.props, nextProps)
		// return true
	}
	render(){
		const {bemBlock, hasFilters, translate, resetFilters} = this.props
		// console.log(bemBlock, hasFilters, translate, resetFilters)
		return (
			<div>
				<FastClick handler={resetFilters}>
					<div className={bemBlock().state({disabled:!hasFilters})}>
						<div className={bemBlock("reset")}>{translate("reset.clear_all")}</div>
					</div>
				</FastClick>
			</div>
		)
	}
}

export interface ResetFiltersProps extends SearchkitComponentProps {
	component?:ReactComponentType<ResetFiltersDisplayProps>
}

export class ResetFilters extends SearchkitComponent<ResetFiltersProps, any> {

	static translations:any = {
		"reset.clear_all":"Clear all filters"
	}
	translations = ResetFilters.translations

	static propTypes = defaults({
		translations:SearchkitComponent.translationsPropType(
			ResetFilters.translations
		),
		component:React.PropTypes.func
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
			container: (this.props.mod || "reset-filters")
		}
	}

  hasFilters():boolean {
    return this.getQuery().hasFiltersOrQuery()
  }

	resetFilters() {
		this.searchkit.resetState()
		this.searchkit.performSearch()
	}

  render() {
		return React.createElement(this.props.component, {
			bemBlock:this.bemBlocks.container,
			resetFilters:this.resetFilters,
			hasFilters:this.hasFilters(),
			translate:this.translate
		})
  }
}
