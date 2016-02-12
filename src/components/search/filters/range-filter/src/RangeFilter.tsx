import * as React from "react";
const Rcslider = require("rc-slider")

import {
	SearchkitManager,
	SearchkitComponent,
	SearchkitComponentProps,
	FastClick,
	RangeAccessor
} from "../../../../../core"

const defaults = require("lodash/defaults")
const max = require("lodash/max")
const map = require("lodash/map")
const get = require("lodash/get")


export interface RangeFilterProps extends SearchkitComponentProps {
	field:string
  min:number
  max:number
  id:string
	title:string
  interval?:number
	showHistogram?:boolean
}

export class RangeFilter extends SearchkitComponent<RangeFilterProps, any> {
	accessor:RangeAccessor

	static propTypes = defaults({
		field:React.PropTypes.string.isRequired,
		title:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired
	}, SearchkitComponent.propTypes)

	constructor(props){
		super(props)
		this.sliderUpdate = this.sliderUpdate.bind(this)
		this.sliderUpdateAndSearch = this.sliderUpdateAndSearch.bind(this)
	}

	defineAccessor() {
		const { id, title, min, max, field, interval } = this.props
		return new RangeAccessor(
			id,
			{id, min, max, title, field, interval}
		)
	}

	defineBEMBlocks() {
		let block = this.props.mod || "sk-range-filter"
		return {
			container: block,
			labels: block+"-value-labels"
		}
	}

  sliderUpdate(newValues) {
  	if ((newValues[0] == this.props.min) && (newValues[1] == this.props.max)){
  		this.accessor.state = this.accessor.state.clear()
  	} else {
    	this.accessor.state = this.accessor.state.setValue({min:newValues[0], max:newValues[1]})
  	}
		this.forceUpdate()
	}

	sliderUpdateAndSearch(newValues){
		this.sliderUpdate(newValues)
		this.searchkit.performSearch()
	}

	getMaxValue() {
		if (this.accessor.getBuckets() == 0) return 0
		return max(map(this.accessor.getBuckets(), "doc_count"))
	}

	getHistogram() {
		if (!this.props.showHistogram) return null

		let maxValue = this.getMaxValue()

		if (maxValue === 0) return null

		const min = get(this.accessor.state.getValue(), "min", this.props.min)
		const max = get(this.accessor.state.getValue(), "max", this.props.max)

		let bars = map(this.accessor.getBuckets(), (value:any, i) => {
			var className = "bar-chart__bar";
			if (value.key < min || value.key > max) className += " is-out-of-bounds";
			return (
				<div className={className}
					key={value.key}
					style={{
						height:`${(value.doc_count/maxValue)*100}%`
					}}>
				</div>
			)
		})

		return (
			<div className="bar-chart">
				{bars}
			</div>
		)

	}

	render() {
		var block = this.bemBlocks.container
		var histogram = this.getHistogram()

		var classname = block().state({
			disabled:this.getMaxValue() == 0,
			"no-histogram": histogram == null
		})
		var sliderClassname = block("bar-chart").toString()

		return (
			<div className={classname}>
				<div className={block("header")}>{this.translate(this.props.title)}</div>
				{histogram}
        <Rcslider
          min={this.props.min}
          max={this.props.max}
          range={true}
					value={[
						get(this.accessor.state.getValue(), "min", this.props.min),
						get(this.accessor.state.getValue(), "max", this.props.max)
					]}
					onChange={this.sliderUpdate}
          onAfterChange={this.sliderUpdateAndSearch}/>
					<div className={block("x-label").mix(this.bemBlocks.labels())}>
						<div className={this.bemBlocks.labels("min")}>{this.props.min}</div>
						<div className={this.bemBlocks.labels("max")}>{this.props.max}</div>
					</div>
			</div>
		);
	}
}
