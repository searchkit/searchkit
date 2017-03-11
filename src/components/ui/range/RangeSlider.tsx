import * as React from "react";

import { RangeProps } from './RangeProps'

import { identity } from "lodash"
let Rcslider = require("rc-slider")

let block = require("bem-cn")
import { PureRender } from "../../../core/react/pure-render"

export interface RangeSliderProps extends RangeProps {
  step?: number
  marks?: Object
  rangeFormatter?:(n: number)=> number | string
}

@PureRender
export class RangeSlider extends React.Component<RangeSliderProps, {}> {

  static defaultProps = {
    mod: "sk-range-slider",
    rangeFormatter:identity
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
    const { mod, className, step, marks,rangeFormatter,
      min, max, minValue, maxValue } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    return (
      <div className={bemBlocks.container().mix(className)}>
        <Rcslider
          min={min}
          max={max}
          marks={marks || {
            [min]: rangeFormatter(min),
            [max]: rangeFormatter(max)
          }}
          tipFormatter={rangeFormatter}
          range={true}
          step={step}
          value={[minValue, maxValue]}
          onChange={this.onChange}
          onAfterChange={this.onFinished}/>
      </div>
    )
  }
}
