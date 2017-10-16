import * as PropTypes from "prop-types";

import {
	SearchkitComponent,
	SearchkitComponentProps,	
	RenderComponentType,
	RenderComponentPropType,
	renderComponent,
  DynamicRangeAccessor,
	FieldOptions
} from "../../../../core"

import {
	RangeProps, Panel,
	RangeSlider
} from "../../../ui"

const defaults = require("lodash/defaults")
const get = require("lodash/get")
const identity = require("lodash/identity")

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
		field:PropTypes.string.isRequired,
		title:PropTypes.string.isRequired,
		id:PropTypes.string.isRequired,
		containerComponent:RenderComponentPropType,
		rangeComponent:RenderComponentPropType,
		rangeFormatter:PropTypes.func,
		fieldOptions:PropTypes.shape({
			type:PropTypes.oneOf(["embedded", "nested", "children"]).isRequired,
			options:PropTypes.object
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
		const { 
			id, title, field, fieldOptions, 
			rangeFormatter, translations  } = this.props
		return new DynamicRangeAccessor(id,{
			id, title, field, fieldOptions, 
			rangeFormatter, translations
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
