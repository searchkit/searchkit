import * as React from "react";
import * as _ from "lodash";
import "../styles/index.scss";

import {
	SearchkitComponent,
  Accessor,
  LevelState,
	FastClick,
	AggsList,
	Terms,
	BoolMust,
	Term
} from "../../../../../core"

export interface PathFacetAccessorOptions {
	field:string
	id:string
	title:string
}

export class PathFacetAccessor extends Accessor<LevelState> {
	state = new LevelState()
	options:any

	constructor(key, options:PathFacetAccessorOptions){
		super(key, options.id)
		this.options = options
	}

	getBuckets(path) {
		const results = this.getResults()
    const rpath = ['aggregations',this.key, path,'buckets']
    return _.get(results, rpath, [])
	}

	buildSharedQuery(query) {

		let levelFilters = this.state.getValue()

		var filterTerms = _.map(levelFilters, (level, i) => {
			let filter = level[0]
			let value = filter.slice(_.get(levelFilters,[i-1,0],"/").length)
			return Term(this.options.field, filter, {
				$name:this.options.title || this.translate(this.key),
				$value:this.translate(value),
				$id:this.options.id,
				$disabled: false,
				$remove:()=> {
					this.state = this.state.clear(i)
		    }
			})
		})

		if(filterTerms.length > 0){
      query = query.addFilter(this.options.field, BoolMust(filterTerms))
    }

    return query
  }

  buildOwnQuery(query){

		let aggs = {
			["/"]: Terms(this.options.field, {
					size:0,
					include:"/(.|\\/)+",
					exclude:"/(.|\\/)+/(.|\\/)+"
				})
		}

		_.forEach(this.state.getValue(), (value) => {
			aggs[value] = Terms(this.options.field, {
				size:0,
				include:value+"/(.|\\/)+",
				exclude:value+"/(.|\\/)+/(.|\\/)+"
			})
		});

		query = query.setAggs(AggsList(
			this.key,
			query.getFilters(this.options.field),
			aggs
		))

    return query
  }

}

export interface IHierarchicalRefinementFilter {
	id:string
	field:string
	title:string
	mod?:string
}

export class HierarchicalRefinementFilter extends SearchkitComponent<IHierarchicalRefinementFilter, any> {
	public accessor:PathFacetAccessor

	constructor(props:IHierarchicalRefinementFilter) {
		super(props)
	}

	defineBEMBlocks() {
		var blockClass = this.props.mod || "hierarchical-menu";
		return {
			container:`${blockClass}-list`,
			option:`${blockClass}-option`
		};
	}

	shouldCreateNewSearcher() {
		return true;
	}

	defineAccessor() {
		return new PathFacetAccessor(
			this.props.id,
			{id:this.props.id, title:this.props.title, field:this.props.field}
		)
	}

	addFilter(level, option) {
		this.accessor.state = this.accessor.state.clear(level);
		this.accessor.state = this.accessor.state.add(level, option.key)
		this.searchkit.performSearch()
	}

	renderOption(path, level, option) {

		var block = this.bemBlocks.option
		var isSelected = this.accessor.state.contains(level, option.key)

		var className = block().state({
			selected:isSelected
		})

		return (
			<div key={option.key}>
				<FastClick handler={this.addFilter.bind(this, level, option)}>
					<div className={className}>
						<div className={block("text")}>{this.translate(option.key.slice(path.length))}</div>
						<div className={block("count")}>{option.doc_count}</div>
					</div>
				</FastClick>
					{(() => {
						if(isSelected) {
							return this.renderOptions(option.key, level+1);
						}
					})()}
			</div>
		)
	}

	renderOptions(path, level) {
		let block = this.bemBlocks.container;
		return (
			<div className={block("hierarchical-options")}>
			{
        _.map(this.accessor.getBuckets(path), this.renderOption.bind(this,path, level))
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
					{this.renderOptions("/", 0)}
				</div>
			</div>
		)
	}



}
