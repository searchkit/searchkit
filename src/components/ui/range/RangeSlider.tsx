import * as React from "react";

import { RangeProps } from './RangeProps'

const Rcslider = require("rc-slider")

const block = require('bem-cn')

export interface RangeSliderProps extends RangeProps {
  step?: number
  marks: Object
}

export class RangeSlider extends React.Component<RangeSliderProps, {}> {

  static defaultProps = {
    mod: "sk-range-slider",
  }

  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onFinished = this.onFinished.bind(this)
  }

  onChange([min, max]) {
    this.props.onChange({ min, max })
  }

  onFinished([min, max]) {
    this.props.onFinished({ min, max })
  }

  render() {
    const { mod, className, step, marks,
      min, max, minValue, maxValue } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    return (
      <div className={bemBlocks.container().mix(className)}>
        <Rcslider
          min={min}
          max={max}
          marks={marks || { [min]: min, [max]: max }}
          range={true}
          step={step}
          value={[minValue, maxValue]}
          onChange={this.onChange}
          onAfterChange={this.onFinished}/>
      </div>
    )
  }
}
