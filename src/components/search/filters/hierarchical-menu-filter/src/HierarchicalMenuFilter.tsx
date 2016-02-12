import * as React from "react";

import {
	SearchkitComponent,
  HierarchicalFacetAccessor,
	FastClick,
	SearchkitComponentProps
} from "../../../../../core"

const defaults = require("lodash/defaults")
const map = require("lodash/map")

export interface HierarchicalMenuFilterProps extends SearchkitComponentProps{
	id:string
	fields:Array<string>
	title:string
	size?:number
	orderKey?:string
	orderDirection?:string
}

export class HierarchicalMenuFilter extends SearchkitComponent<HierarchicalMenuFilterProps, any> {
	public accessor:HierarchicalFacetAccessor

	static propTypes = defaults({
		id:React.PropTypes.string.isRequired,
		fields:React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
		title:React.PropTypes.string.isRequired,
		orderKey:React.PropTypes.string,
		orderDirection:React.PropTypes.oneOf(["asc", "desc"])
	}, SearchkitComponent.propTypes)

	constructor(props:HierarchicalMenuFilterProps) {
		super(props)
	}

	defineBEMBlocks() {
		var blockClass = this.props.mod || "sk-hierarchical-menu";
		return {
			container:`${blockClass}-list`,
			option:`${blockClass}-option`
		};
	}

	defineAccessor() {
		const {id, title, fields, size=0, orderKey, orderDirection} = this.props
		return new HierarchicalFacetAccessor(id, {
			id, title, fields, size, orderKey, orderDirection
		})
	}

	addFilter(option, level) {
		this.accessor.state = this.accessor.state.toggleLevel(
			level,option.key)

		this.searchkit.performSearch()
	}

	renderOption(level, option) {

		var block = this.bemBlocks.option

		var className = block().state({
			selected:this.accessor.state.contains(level, option.key)
		})

		return (
			<div key={option.key}>
				<FastClick handler={this.addFilter.bind(this, option,level)}>
					<div className={className}>
						<div className={block("text")}>{this.translate(option.key)}</div>
						<div className={block("count")}>{option.doc_count}</div>
					</div>
				</FastClick>
					{(() => {
						if(this.accessor.resultsState.contains(level,option.key)) {
							return this.renderOptions(level+1);
						}
					})()}
			</div>
		)
	}

	renderOptions(level) {
		let block = this.bemBlocks.container;
		return (
			<div className={block("hierarchical-options")}>
			{map(this.accessor.getBuckets(level), this.renderOption.bind(this,level))}
			</div>
		)
	}

  render(){
		let block = this.bemBlocks.container;
		let classname = block()
			.mix(`filter--${this.props.id}`)
			.state({
				disabled: this.accessor.getBuckets(0).length == 0
			})
    return (
			<div className={classname}>
				<div className={block("header")}>{this.props.title}</div>
				<div className={block("root")}>
					{this.renderOptions(0)}
				</div>
			</div>
		)
	}

}
