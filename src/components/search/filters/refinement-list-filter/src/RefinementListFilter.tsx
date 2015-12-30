import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	Searcher,
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick
} from "../../../../../core"



export interface IRefinementListFilter {
	field:string
	operator?:string
	size?:number
	title:string
	id:string
	mod?:string
}

export class RefinementListFilter extends SearchkitComponent<IRefinementListFilter, any> {
	accessor:FacetAccessor
	defaultSize:number

	shouldCreateNewSearcher() {
		return true;
	}

	constructor(props) {
		super(props);
		this.defaultSize = (this.props.size || 50)
		this.state = {
			size: this.defaultSize
		}
	}

	defineAccessor() {
		return new FacetAccessor(
			this.props.field,
			{id:this.props.id, operator:this.props.operator, title:this.props.title, size:this.state.size}
		)
	}

	defineBEMBlocks() {
		var blockName = this.props.mod || "refinement-list"
		return {
			container: blockName,
			option: `${blockName}-option`
		}
	}

	addFilter(option) {
		this.accessor.state = this.accessor.state.toggle(option.key)
		this.searchkit.performSearch()
	}

	renderOption(option) {
		let block = this.bemBlocks.option
		let isSelected = this.accessor.state.contains(option.key)

		let optionClassName = block()
			.mix(this.bemBlocks.container("item"))
			.state({selected:isSelected})

		return (
			<FastClick handler={this.addFilter.bind(this, option)} key={option.key}>
				<div className={optionClassName}>
					<div className={block("checkbox").state({selected:isSelected})}></div>
					<div className={block("text")}>{this.translate(option.key)}</div>
					<div className={block("count")}>{option.doc_count}</div>
				</div>
			</FastClick>
		)
	}

	hasOptions():boolean {
		return this.accessor.getBuckets().length != 0
	}

	toggleViewMore(size) {
		this.setState({size:size})
		this.accessor.setSize(size)
		this.searchkit.performSearch()
	}

	renderShowMore() {
		let total = this.accessor.getCount()
		let label = ""
		let size = 0

		if (total < this.state.size && this.state.size == this.defaultSize) {
			return null
		}

		if (this.state.size >= total) {
			size = this.defaultSize
			label = "view less"
		} else if ((this.state.size + 50) >= total) {
			size = this.state.size + 50
			label = "view all"
		} else {
			size = this.state.size + 50
			label = "view more"
		}

		return (
			<FastClick handler={this.toggleViewMore.bind(this, size)}>
				<div className={this.bemBlocks.container("view-more-action")}>
					{label}
				</div>
			</FastClick>
		)
	}

	render() {

		let block = this.bemBlocks.container
		let className = block()
			.mix(`filter--${this.props.id}`)
			.state({
				disabled: !this.hasOptions()
			})

		return (
			<div className={className}>
				<div className={block("header")}>{this.props.title}</div>
				<div className={block("options")}>
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
				{this.renderShowMore()}
      </div>
		);
	}
}
