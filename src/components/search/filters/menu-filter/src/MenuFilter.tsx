import * as React from "react";

import {
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick,
	SearchkitComponentProps,
	ReactComponentType
} from "../../../../../core"

import {FilterItemComponent, FilterItemComponentProps} from "../../filter-item/src/FilterItem";

const defaults = require("lodash/defaults")
const map = require("lodash/map")

export interface MenuFilterProps extends SearchkitComponentProps {
	field:string
	title:string
	id:string
	size?:number
	itemComponent?:ReactComponentType<FilterItemComponentProps>,
	orderKey?:string
	orderDirection?:string
}

export class MenuFilter extends SearchkitComponent<MenuFilterProps, any> {
	accessor:FacetAccessor

	static propTypes = defaults({
		field:React.PropTypes.string.isRequired,
		title:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired,
		size:React.PropTypes.number,
		orderKey:React.PropTypes.string,
		orderDirection:React.PropTypes.oneOf(["asc", "desc"]),
	}, SearchkitComponent.propTypes)

	static defaultProps = {
		itemComponent:FilterItemComponent
	}

	defineBEMBlocks() {
		var blockName = this.props.mod || "sk-menu-list"
		return {
			container: blockName,
			option: `${blockName}-option`
		}
	}

	defineAccessor() {
		const {field, id, size=50, title, orderKey, orderDirection} = this.props
		const operator = "OR"
		return new FacetAccessor(field, {
			id, operator, title, size, orderKey, orderDirection
		})
	}

	addFilter(option) {
		if (option === "All" || this.accessor.state.contains(option)) {
			this.accessor.state = this.accessor.state.clear();
		} else {
			this.accessor.state = this.accessor.state.setValue([option]);
		}
		this.searchkit.performSearch()
	}

	renderOption(key, count, isSelected) {

		return (
			React.createElement(this.props.itemComponent, {
				toggleFilter:this.addFilter.bind(this, key),
				bemBlocks: this.bemBlocks,
				label:this.translate(key),
				key:key,
				docCount:count,
				selected:isSelected,
				translate:this.translate
			})
		)
	}

	createOption(option) {
		const isChecked = this.accessor.state.contains(option.key)
		return this.renderOption(option.key, option.doc_count, isChecked);
	}

	render() {
		var block = this.bemBlocks.container
		var className = block().mix(`filter--${this.props.id}`)
		let isAllChecked = () => {
			return !this.accessor.state.getValue() || this.accessor.state.getValue().length == 0
		}

		return (
			<div className={className}>
				<div className={block("header")}>{this.props.title}</div>
				<div className={block("options")}>
				{this.renderOption("All", null, isAllChecked())}
				{map(this.accessor.getBuckets(), this.createOption.bind(this))}
				</div>
			</div>
		);
	}
}
