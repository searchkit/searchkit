import * as React from "react";
import * as PropTypes from "prop-types";

import {
	SearchkitComponent,
	HierarchicalFacetAccessor,
	FastClick,
	SearchkitComponentProps,
	renderComponent,
	RenderComponentType,
	RenderComponentPropType
} from "../../../../../core"

import {
	Panel, ItemComponent, ItemProps
} from "../../../../ui"

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const identity = require("lodash/identity")

export interface HierarchicalMenuFilterProps extends SearchkitComponentProps {
	id: string
	fields: Array<string>
	title: string
	size?: number
	orderKey?: string
	orderDirection?: string
	countFormatter?: (count: number) => string | number
	containerComponent?: RenderComponentType<any>
	itemComponent?: RenderComponentType<ItemProps>
}

export class HierarchicalMenuFilter extends SearchkitComponent<HierarchicalMenuFilterProps, any> {
	public accessor: HierarchicalFacetAccessor

	static defaultProps = {
		countFormatter: identity,
		size: 20,
		containerComponent:Panel,
		itemComponent:ItemComponent
	}
	static propTypes = defaults({
		id: PropTypes.string.isRequired,
		fields: PropTypes.arrayOf(PropTypes.string).isRequired,
		title: PropTypes.string.isRequired,
		orderKey: PropTypes.string,
		orderDirection: PropTypes.oneOf(["asc", "desc"]),
		countFormatter: PropTypes.func,
		containerComponent: RenderComponentPropType,
		itemComponent: RenderComponentPropType
	}, SearchkitComponent.propTypes)

	defineBEMBlocks() {
		var blockClass = this.props.mod || "sk-hierarchical-menu";
		return {
			container: `${blockClass}-list`,
			option: `${blockClass}-option`
		};
	}

	defineAccessor() {
		const { id, title, fields, size, orderKey, orderDirection } = this.props
		return new HierarchicalFacetAccessor(id, {
			id, title, fields, size, orderKey, orderDirection
		})
	}

	addFilter(option, level) {
		this.accessor.state = this.accessor.state.toggleLevel(
			level, option.key)

		this.searchkit.performSearch()
	}

	renderOption(level, option) {

		var block = this.bemBlocks.option
		const { countFormatter, itemComponent } = this.props
		const active = this.accessor.state.contains(level, option.key) 
		
		return (
			<div key={option.key}>
				{renderComponent(itemComponent, {
					active,
					itemKey:option.key,
					showCount:true,
					bemBlocks:this.bemBlocks,
					onClick:this.addFilter.bind(this, option, level),
					label:this.translate(option.key),
					count:countFormatter(option.doc_count)
				})}
				{(() => {
					if (this.accessor.resultsState.contains(level, option.key)) {
						return this.renderOptions(level + 1);
					}
				})()}
			</div>
		)
	}

	renderOptions(level) {
		let block = this.bemBlocks.container;
		return (
			<div className={block("hierarchical-options")}>
				{map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))}
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
