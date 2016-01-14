import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	ISizeOption,
	SearchkitComponentProps,
	FastClick
} from "../../../../../core"

export interface RefinementListFilterProps extends SearchkitComponentProps {
	field:string
	operator?:string
	size?:number
	title:string
	id:string
}

export class RefinementListFilter extends SearchkitComponent<RefinementListFilterProps, any> {
	accessor:FacetAccessor

	static propTypes = _.defaults({
		field:React.PropTypes.string.isRequired,
		operator:React.PropTypes.oneOf(["AND", "OR"]),
		size:React.PropTypes.number,
		title:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired,
		translations:SearchkitComponent.translationsPropType(
			FacetAccessor.translations
		)
	}, SearchkitComponent.propTypes)

	defineAccessor() {
		return new FacetAccessor( this.props.field,{
			id:this.props.id, operator:this.props.operator,
			title:this.props.title, size:(this.props.size || 50),
			translations:this.props.translations
		})
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
				<div className={optionClassName} data-qa="option">
					<div data-qa="checkbox" className={block("checkbox").state({selected:isSelected})}></div>
					<div data-qa="label" className={block("text")}>{this.translate(option.key)}</div>
					<div data-qa="count" className={block("count")}>{option.doc_count}</div>
				</div>
			</FastClick>
		)
	}

	hasOptions():boolean {
		return this.accessor.getBuckets().length != 0
	}

	toggleViewMoreOption(option:ISizeOption) {
		this.accessor.setViewMoreOption(option);
		this.searchkit.performSearch()
	}

	renderShowMore() {

		let option = this.accessor.getMoreSizeOption()

		if (!option) {
			return null;
		}

		return (
			<FastClick handler={this.toggleViewMoreOption.bind(this, option)}>
				<div data-qa="show-more" className={this.bemBlocks.container("view-more-action")}>
					{this.translate(option.label)}
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
			<div data-qa={`filter--${this.props.id}`} className={className}>
				<div data-qa="header" className={block("header")}>{this.props.title}</div>
				<div data-qa="options" className={block("options")}>
				{_.map(this.accessor.getBuckets(), this.renderOption.bind(this))}
				</div>
				{this.renderShowMore()}
      </div>
		);
	}
}
