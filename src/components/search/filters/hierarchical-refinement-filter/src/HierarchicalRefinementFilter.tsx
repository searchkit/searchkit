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
	Term,
	NestedFilter
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

	getBuckets(level) {
		const results = this.getResults()
    const rpath = ['aggregations',this.key, "lvl"+level,"parents",'buckets']
    return _.get(results, rpath, [])
	}

	buildSharedQuery(query) {

		let levelFilters = this.state.getValue()
		let lastIndex = levelFilters.length - 1
		var filterTerms = _.map(levelFilters, (filter,i) => {

			let value = filter[0]
			let isLeaf = i === lastIndex
			let subField = isLeaf ? ".value" : ".ancestors"
			return Term(this.options.field + subField, value, {
				$name:this.options.title || this.translate(this.key),
				$value:this.translate(value),
				$id:this.options.id,
				$disabled: !isLeaf,
				$remove:()=> {
					this.state = this.state.clear(i)
		    }
			})
		})

		if(filterTerms.length > 0){
      query = query.addFilter(this.options.field,
				NestedFilter(this.options.field, BoolMust(filterTerms)))
    }

    return query
  }

  buildOwnQuery(query){

		let aggs = {
			"lvl0":{
				filter: {
					bool:{
						must:[
							Term("taxonomy.level", 1)
						]
					}
				},
				"aggs":{
					"parents":{
						 "terms":{
									"field":"taxonomy.value",
									"size":0
							}
					}
				}
			}
		}

		let levels = this.state.getValue()
		_.each(levels, (level,i) => {
			let ancestors = _.map(_.take(levels, i+1), (level)=>{
				return Term("taxonomy.ancestors", level[0])
			})
			aggs["lvl"+(i+1)] = {
				filter: {
					bool:{
						must:[
							Term("taxonomy.level", i+2),
							...ancestors
						]
					}
				},
				"aggs":{
					"parents":{
						 "terms":{
									"field":"taxonomy.value",
									"size":0
							}
					}
				}
			}
		})

		query = query.setAggs({
			taxonomy: {
				nested: {
					path: "taxonomy"
				},
				aggs: aggs
			}
		})

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
