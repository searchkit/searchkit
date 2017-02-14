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
	renderComponent,
	FieldOptions
} from "../../../../../core"

import {
	RangeProps, Panel, RangeComponentBuilder,
	RangeSliderHistogram, RangeSlider
} from "../../../../ui"

import {defaults} from "lodash"
import {map} from "lodash"
import {get} from "lodash"

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
	rangeFormatter?:(count:number)=> number | string
	marks?:Object
	fieldOptions?:FieldOptions
}



export class RangeFilter extends SearchkitComponent<RangeFilterProps, any> {
	accessor:RangeAccessor

	static propTypes = defaults({
		field:React.PropTypes.string.isRequired,
		title:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired,
		containerComponent:RenderComponentPropType,
		rangeComponent:RenderComponentPropType,
		fieldOptions:React.PropTypes.shape({
			type:React.PropTypes.oneOf(["embedded", "nested", "children"]).isRequired,
			options:React.PropTypes.object
		}),
		rangeFormatter:React.PropTypes.func,
		marks:React.PropTypes.object
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
		const { id, title, min, max, field, fieldOptions,
			interval, showHistogram } = this.props
		return new RangeAccessor(id,{
			id, min, max, title, field,
			interval, loadHistogram:showHistogram, fieldOptions
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

	getRangeComponent():RenderComponentType<any>{
	  const { rangeComponent, showHistogram } = this.props
	  if (!showHistogram && (rangeComponent === RangeSliderHistogram)) {
	    return RangeSlider
	  } else {
	    return rangeComponent
	  }
	}

	render() {
    const { id, title, containerComponent } = this.props

    return renderComponent(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: this.accessor.isDisabled()
    }, this.renderRangeComponent(this.getRangeComponent()))
  }

  renderRangeComponent(component: RenderComponentType<any>) {
    const { min, max, rangeFormatter, marks } = this.props
    const state = this.accessor.state.getValue()
    return renderComponent(component, {
      min, max,
      minValue: Number(get(state, "min", min)),
      maxValue: Number(get(state, "max", max)),
      items: this.accessor.getBuckets(),
      onChange: this.sliderUpdate,
      onFinished: this.sliderUpdateAndSearch,
			rangeFormatter, marks
    })
  }

}
