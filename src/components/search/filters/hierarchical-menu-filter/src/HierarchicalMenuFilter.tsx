import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
import {
	SearchkitComponent,
  HierarchicalFacetAccessor
} from "../../../../../core"

require("./../styles/index.scss");

export interface IHierarchicalMenuFilter {
	id:string
	fields:Array<string>
	title:string
}

export class HierarchicalMenuFilter extends SearchkitComponent<IHierarchicalMenuFilter, any> {
	public accessor:HierarchicalFacetAccessor

	constructor(props:IHierarchicalMenuFilter) {
		super(props)
	}

	shouldCreateNewSearcher() {
		return true;
	}

	defineAccessor() {
		return new HierarchicalFacetAccessor(
			this.props.id,
			{id:this.props.id, title:this.props.title, fields:this.props.fields}
		)
	}

	addFilter(option, level) {
		this.accessor.state.clear(level);
		this.accessor.state.add(level, option.key);
		this.searchkit.performSearch()
	}

	renderOption(level, option) {

		var className = classNames({
			"hierarchical-menu-option--selected":this.accessor.state.contains(level, option.key),
			"hierarchical-menu-option":true
		})

		return (
			<div key={option.key}>
				<div className={className} onClick={this.addFilter.bind(this, option,level)}>{option.key} ({option.doc_count})</div>
				<div>
					{(() => {
						if(this.accessor.state.contains(level,option.key)) {
							return this.renderOptions(level+1);
						}
					})()}
				</div>
			</div>
		)
	}

	renderOptions(level) {
		return (
			<div className="hierarchical-menu-list__hierarchical-options">
			{_.map(this.accessor.getBuckets(level), this.renderOption.bind(this,level))}
			</div>
		)
	}

  render(){
		var className = classNames({
			"hierarchical-menu-list":true,
			[this.props.id]:true
		})
    return (
			<div className={className}>
				<div className="hierarchical-menu-list__header">{this.props.title}</div>
				{this.renderOptions(0)}
			</div>
		)
	}

}
