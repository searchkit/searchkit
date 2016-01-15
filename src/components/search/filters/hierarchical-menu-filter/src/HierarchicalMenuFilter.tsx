import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	SearchkitComponent,
  HierarchicalFacetAccessor,
	FastClick,
	SearchkitComponentProps
} from "../../../../../core"

export interface HierarchicalMenuFilterProps extends SearchkitComponentProps{
	id:string
	fields:Array<string>
	title:string
}

export class HierarchicalMenuFilter extends SearchkitComponent<HierarchicalMenuFilterProps, any> {
	public accessor:HierarchicalFacetAccessor

	static propTypes = _.defaults({
		id:React.PropTypes.string.isRequired,
		fields:React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
		title:React.PropTypes.string.isRequired
	}, SearchkitComponent.propTypes)

	constructor(props:HierarchicalMenuFilterProps) {
		super(props)
	}

	defineBEMBlocks() {
		var blockClass = this.props.mod || "hierarchical-menu";
		return {
			container:`${blockClass}-list`,
			option:`${blockClass}-option`
		};
	}

	defineAccessor() {
		return new HierarchicalFacetAccessor(
			this.props.id,
			{id:this.props.id, title:this.props.title, fields:this.props.fields, size:0}
		)
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
			{_.map(this.accessor.getBuckets(level), this.renderOption.bind(this,level))}
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
