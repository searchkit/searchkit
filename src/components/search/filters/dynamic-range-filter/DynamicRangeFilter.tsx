import * as React from "react";

import {
	SearchkitManager,
	SearchkitComponent,
	SearchkitComponentProps,
	FastClick,
	RangeAccessor,
	RenderComponentType,
	RenderComponentPropType,
	renderComponent,
  DynamicRangeAccessor,
	FieldOptions
} from "../../../../core"

import {
	RangeProps, Panel, RangeComponentBuilder,
	RangeSlider
} from "../../../ui"

import {defaults} from "lodash"
import {map} from "lodash"
import {get} from "lodash"
import {identity} from "lodash"

export interface DynamicRangeFilterProps extends SearchkitComponentProps {
	field:string
  id:string
	title:string
	containerComponent?: RenderComponentType<any>
  rangeComponent?: RenderComponentType<RangeProps>
	rangeFormatter?:(count:number)=> number | string
	fieldOptions?:FieldOptions

}

export class DynamicRangeFilter extends SearchkitComponent<DynamicRangeFilterProps, any> {
	accessor:DynamicRangeAccessor

	static propTypes = defaults({
		field:React.PropTypes.string.isRequired,
		title:React.PropTypes.string.isRequired,
		id:React.PropTypes.string.isRequired,
		containerComponent:RenderComponentPropType,
		rangeComponent:RenderComponentPropType,
		rangeFormatter:React.PropTypes.func,
		fieldOptions:React.PropTypes.shape({
			type:React.PropTypes.oneOf(["embedded", "nested", "children"]).isRequired,
			options:React.PropTypes.object
		}),
	}, SearchkitComponent.propTypes)

	static defaultProps = {
		containerComponent: Panel,
		rangeComponent: RangeSlider,
		rangeFormatter:identity
	}

	constructor(props){
		super(props)
		this.sliderUpdate = this.sliderUpdate.bind(this)
		this.sliderUpdateAndSearch = this.sliderUpdateAndSearch.bind(this)
	}

	defineAccessor() {
		const { id, title, field, fieldOptions } = this.props
		return new DynamicRangeAccessor(id,{
			id, title, field, fieldOptions
		})
	}

	defineBEMBlocks() {
		let block = this.props.mod || "sk-dynamic-range-filter"
		return {
			container: block,
			labels: block+"-value-labels"
		}
	}

  getMinMax() {
    return {
      min: this.accessor.getStat("min") || 0,
      max: this.accessor.getStat("max") || 0
    }
  }

  sliderUpdate(newValues) {
    const {min, max} = this.getMinMax()

  	if ((newValues.min == min) && (newValues.max == max)){
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

	render() {
    const { id, title, containerComponent } = this.props

    return renderComponent(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: this.accessor.isDisabled()
    }, this.renderRangeComponent(this.props.rangeComponent))
  }

  renderRangeComponent(component: RenderComponentType<any>) {
    const {min, max} = this.getMinMax()
		const {rangeFormatter} = this.props
    const state = this.accessor.state.getValue()
    return renderComponent(component, {
      min, max,
      minValue: Number(get(state, "min", min)),
      maxValue: Number(get(state, "max", max)),
			rangeFormatter,
      onChange: this.sliderUpdate,
      onFinished: this.sliderUpdateAndSearch
    })
  }

}
