import * as React from "react";
import * as _ from "lodash";
const Rcslider = require("rc-slider")
import "../styles/index.scss";


import {
	SearchkitManager,
	SearchkitComponent,
	SearchkitComponentProps,
	FastClick,
  FilterBasedAccessor,
  ObjectState,
	FilterBucket,
	RangeQuery,
	BoolMust
} from "../../../../../core"

export interface RangeAccessorOptions {
	title:string
	id:string
	min:number
	max:number
	field:string
}

export class RangeAccessor extends FilterBasedAccessor<ObjectState> {
	options:any
	state = new ObjectState()

	constructor(key, options:RangeAccessorOptions){
    super(key, options.id)
    this.options = options
  }

	buildSharedQuery(query) {
		if (this.state.hasValue()) {
			let val:any = this.state.getValue()
			let rangeFilter = RangeQuery(this.options.field, val.min, val.max)
			let selectedFilter = {
				name:this.translate(this.options.title),
				value:`${val.min} - ${val.max}`,
				id:this.options.id,
				remove:()=> {
					this.state = this.state.clear()
				}
			}

			return query
				.addFilter(this.uuid, BoolMust([rangeFilter]))
				.addSelectedFilter(selectedFilter)

		}

		return query
	}

	getBuckets(){
    return this.getAggregations(
      [this.key, this.key, "buckets"], []
    )
  }

  buildOwnQuery(query) {
		let histogramBucket = {
			[this.key]:{
			"histogram":{
				 "field":this.options.field,
				 "interval":(this.options.max - this.options.min) / 20,
				 "extended_bounds":{
						 "min":this.options.min,
						 "max":this.options.max
				 }
			}
		}}
		query = query.setAggs(FilterBucket(
			this.key,
			query.getFiltersWithoutKeys(),
			histogramBucket
		))
    return query;
  }

}

export interface RangeFilterProps extends SearchkitComponentProps {
	field:string
  min:number
  max:number
  id:string
	title:string
}

export class RangeFilter extends SearchkitComponent<RangeFilterProps, any> {
	accessor:RangeAccessor

	static propTypes = _.defaults({
		field:React.PropTypes.string.isRequired,
		title:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired
	}, SearchkitComponent.propTypes)

	constructor(props) {
		this.state = {
			min:0,
			max:100
		}
		super(props)
	}

	defineAccessor() {
		return new RangeAccessor(
			this.props.id,
			{id: this.props.id, title:this.props.title, min:this.props.min, max:this.props.max, field:this.props.field}
		)
	}

	defineBEMBlocks() {
		return {
			container: this.props.mod || "range-filter",
		}
	}

  sliderUpdate(newValues) {
    this.accessor.state = this.accessor.state.setValue({min:newValues[0], max:newValues[1]})
		this.forceUpdate()
	}
	sliderUpdateAndSearch(newValues){
		this.sliderUpdate(newValues)
		this.searchkit.performSearch()
	}

	render() {
		var block = this.bemBlocks.container
		return (
			<div className={block()}>
				<div className={block("header")}>{this.translate(this.props.title)}</div>
        <Rcslider
          min={this.props.min}
          max={this.props.max}
          range={true}
					value={[
						_.get(this.accessor.state.getValue(), "min", this.props.min),
						_.get(this.accessor.state.getValue(), "max", this.props.max)
					]}
					onChange={this.sliderUpdate.bind(this)}
          onAfterChange={this.sliderUpdateAndSearch.bind(this)}/>
			</div>
		);
	}
}
