import * as React from "react"
import * as PropTypes from "prop-types"

import {
	SearchkitComponent,
	NestedFacetAccessor,
	FastClick,
	SearchkitComponentProps,
	RenderComponentType,
	renderComponent,
	RenderComponentPropType
} from "../../../../../core"

import {
	Panel, ItemComponent, ItemProps
} from "../../../../ui"

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const identity = require("lodash/identity")

export interface HierarchicalRefinementFilterProps extends SearchkitComponentProps {
	field: string
	id: string
	title: string
	size?: number
	orderKey?: string
	orderDirection?: string
	startLevel?: number
	countFormatter?: (count: number) => number | string
	containerComponent?: RenderComponentType<any>
	itemComponent?: RenderComponentType<ItemProps>
}

export class HierarchicalRefinementFilter extends SearchkitComponent<HierarchicalRefinementFilterProps, any> {
	public accessor: NestedFacetAccessor

	static defaultProps = {
		countFormatter: identity,
		containerComponent: Panel,
		itemComponent: ItemComponent
	}

	static propTypes = defaults({
		field: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		orderKey: PropTypes.string,
		orderDirection: PropTypes.oneOf(["asc", "desc"]),
		startLevel: PropTypes.number,
		countFormatter: PropTypes.func,
		containerComponent: RenderComponentPropType,
		itemComponent: RenderComponentPropType
	}, SearchkitComponent.propTypes)

	defineBEMBlocks() {
		var blockClass = this.props.mod || "sk-hierarchical-refinement";
		return {
			container: `${blockClass}-list`,
			option: `${blockClass}-option`
		}
	}

	defineAccessor() {
		const {
			field, id, title, size, orderKey,
			orderDirection, startLevel 
		} = this.props;

		return new NestedFacetAccessor(id, {
			field, id, title, size, orderKey,
			orderDirection, startLevel
		})
	}

	addFilter(level, option) {
		this.accessor.state = this.accessor.state.toggleLevel(level, option.key)
		this.searchkit.performSearch()
	}

	renderOption(level, option) {

		var block = this.bemBlocks.option
		var active = this.accessor.resultsState.contains(level, option.key)
		const { countFormatter, itemComponent } = this.props		

		return (
			<div key={option.key}>
				{renderComponent(itemComponent, {
					active,
					bemBlocks:this.bemBlocks,
					label:this.translate(option.key),
					itemKey:option.key,
					count:countFormatter(option.doc_count),
					showCount:true,
					onClick: this.addFilter.bind(this, level, option)
				})}
				{active && this.renderOptions(level + 1)}					
			</div>
		)
	}

	renderOptions(level) {
		let block = this.bemBlocks.container;
		return (
			<div className={block("hierarchical-options")}>
				{
					map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))
				}
			</div>
		)
	}

	render() {
		const block = this.bemBlocks.container
		const { id, title, containerComponent } = this.props
		return renderComponent(
			containerComponent, {
				title,
				className: id ? `filter--${id}` : undefined,
				disabled: this.accessor.getBuckets(0).length == 0
			},
			<div className={block("root")}>
				{this.renderOptions(0)}
			</div>

		)
	}


}
