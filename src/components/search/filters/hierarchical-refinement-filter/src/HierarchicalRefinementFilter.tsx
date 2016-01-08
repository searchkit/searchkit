import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	SearchkitComponent,
  NestedFacetAccessor,
	FastClick
} from "../../../../../core"

export interface IHierarchicalRefinementFilter {
	id:string
	field:string
	title:string
	mod?:string
}

export class HierarchicalRefinementFilter extends SearchkitComponent<IHierarchicalRefinementFilter, any> {
	public accessor:NestedFacetAccessor

	constructor(props:IHierarchicalRefinementFilter) {
		super(props)
	}

	defineBEMBlocks() {
		var blockClass = this.props.mod || "hierarchical-refinement";
		return {
			container:`${blockClass}-list`,
			option:`${blockClass}-option`
		};
	}

	shouldCreateNewSearcher() {
		return true;
	}

	defineAccessor() {
		return new NestedFacetAccessor(
			this.props.id,
			{id:this.props.id, title:this.props.title, field:this.props.field}
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
        _.map(this.accessor.getBuckets(level), this.renderOption.bind(this, level))
      }
			</div>
		)
	}

  render(){
		let block = this.bemBlocks.container;
    return (
			<div className={block().mix(`filter--${this.props.id}`)}>
				<div className={block("header")}>{this.props.title}</div>
				<div className={block("root")}>
					{this.renderOptions(0)}
				</div>
			</div>
		)
	}



}
