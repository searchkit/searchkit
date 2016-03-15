import * as React from "react";
const Rcslider = require("rc-slider")

import {
	SearchkitManager,
	SearchkitComponent,
	SearchkitComponentProps,
	FastClick,
	RangeAccessor,
	RenderComponentType,
	RenderComponentPropType,
	renderComponent
} from "../../../../../core"

import {
	RangeProps, Panel, RangeComponentBuilder,
	RangeSliderHistogram, RangeSlider
} from "../../../../ui"

const defaults = require("lodash/defaults")
const max = require("lodash/max")
const maxBy = require("lodash/maxBy")
const map = require("lodash/map")
const get = require("lodash/get")

function computeMaxValue(items, field) {
  if (!items || items.length == 0) return 0
  return maxBy(items, field)[field]
}

export interface RangeFilterProps extends SearchkitComponentProps {
	field:string
  min:number
  max:number
  id:string
	title:string
  interval?:number
	showHistogram?:boolean
	containerComponent?: RenderComponentType<any>
  rangeComponent?: RenderComponentType<RangeProps>
  collapsable?: boolean
}



export class RangeFilter extends SearchkitComponent<RangeFilterProps, any> {
	accessor:RangeAccessor

	static propTypes = defaults({
		field:React.PropTypes.string.isRequired,
		title:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired,
		containerComponent:RenderComponentPropType,
		rangeComponent:RenderComponentPropType
	}, SearchkitComponent.propTypes)


	static defaultProps = {
		containerComponent: Panel,
		rangeComponent: RangeSliderHistogram,
		showHistogram: true
	}


	constructor(props){
		super(props)
		this.sliderUpdate = this.sliderUpdate.bind(this)
		this.sliderUpdateAndSearch = this.sliderUpdateAndSearch.bind(this)
	}

	defineAccessor() {
		const { id, title, min, max, field,
			interval, showHistogram } = this.props
		return new RangeAccessor(id,{
			id, min, max, title, field, interval, loadBuckets:showHistogram
		})
	}

	defineBEMBlocks() {
		let block = this.props.mod || "sk-range-filter"
		return {
			container: block,
			labels: block+"-value-labels"
		}
	}

  sliderUpdate(newValues) {
  	if ((newValues.min == this.props.min) && (newValues.max == this.props.max)){
  		this.accessor.state = this.accessor.state.clear()
  	} else {
    	this.accessor.state = this.accessor.state.setValue(newValues)
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

	getRangeComponent():RenderComponentType<any>{
	  const { rangeComponent, showHistogram } = this.props
	  if (!showHistogram && (rangeComponent === RangeSliderHistogram)) {
	    return RangeSlider
	  } else {
	    return rangeComponent
	  }
	}

	render() {
    const { id, title, containerComponent, collapsable } = this.props

    const maxValue = computeMaxValue(this.accessor.getBuckets(), "doc_count")

    return renderComponent(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: maxValue == 0
    }, this.renderRangeComponent(this.getRangeComponent()))
  }

  renderRangeComponent(component: RenderComponentType<any>) {
    const { min, max } = this.props
    const state = this.accessor.state.getValue()
    return renderComponent(component, {
      min, max,
      minValue: Number(get(state, "min", min)),
      maxValue: Number(get(state, "max", max)),
      items: this.accessor.getBuckets(),
      onChange: this.sliderUpdate,
      onFinished: this.sliderUpdateAndSearch
    })
  }

}
