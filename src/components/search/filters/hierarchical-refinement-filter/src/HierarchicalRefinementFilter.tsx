import * as React from "react";

import {
	SearchkitComponent,
  NestedFacetAccessor,
	FastClick,
	SearchkitComponentProps
} from "../../../../../core"

const defaults = require("lodash/defaults")
const omit = require("lodash/omit")
const map = require("lodash/map")

export interface HierarchicalRefinementFilterProps extends SearchkitComponentProps {
	field:string
	id:string
	title:string
  orderKey?:string
  orderDirection?:string
  startLevel?:number
}

export class HierarchicalRefinementFilter extends SearchkitComponent<HierarchicalRefinementFilterProps, any> {
	public accessor:NestedFacetAccessor

	static propTypes = defaults({
		field:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired,
		title:React.PropTypes.string.isRequired,
		orderKey:React.PropTypes.string,
		orderDirection:React.PropTypes.oneOf(["asc", "desc"]),
		startLevel:React.PropTypes.number
	}, SearchkitComponent.propTypes)

	constructor(props:HierarchicalRefinementFilterProps) {
		super(props)
	}

	defineBEMBlocks() {
		var blockClass = this.props.mod || "sk-hierarchical-refinement";
		return {
			container:`${blockClass}-list`,
			option:`${blockClass}-option`
		};
	}

	defineAccessor() {
		return new NestedFacetAccessor(
			this.props.id,
			omit(this.props, ["mod", "searchkit"]) as any
		)
	}

	addFilter(level, option) {
		this.accessor.state = this.accessor.state.toggleLevel(level,option.key)
		this.searchkit.performSearch()
	}

	renderOption(level, option) {

		var block = this.bemBlocks.option
		var isSelected = this.accessor.resultsState.contains(level, option.key)

		var className = block().state({
			selected:isSelected
		})

		return (
			<div key={option.key}>
				<FastClick handler={this.addFilter.bind(this, level, option)}>
					<div className={className}>
						<div className={block("text")}>{this.translate(option.key)}</div>
						<div className={block("count")}>{option.doc_count}</div>
					</div>
				</FastClick>
					{(() => {
						if(isSelected) {
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
			{
        map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))
      }
			</div>
		)
	}

  render(){
		let block = this.bemBlocks.container;
    return (
			<div data-qa={`filter--${this.props.id}`} className={block().mix(`filter--${this.props.id}`)}>
				<div data-qa="title" className={block("header")}>{this.props.title}</div>
				<div data-qa="options" className={block("root")}>
					{this.renderOptions(0)}
				</div>
			</div>
		)
	}



}
