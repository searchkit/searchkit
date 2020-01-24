import * as React from 'react'

import { block } from '../../../core'
import { RangeProps } from './RangeProps'

const identity = require('lodash/identity')
const Slider = require('rc-slider')
const createSliderWithTooltip = Slider.createSliderWithTooltip
const Range = createSliderWithTooltip(Slider.Range)

export interface RangeSliderProps extends RangeProps {
  step?: number
  marks?: Record<string, any>
  rangeFormatter?: (n: number) => number | string
}

export class RangeSlider extends React.PureComponent<RangeSliderProps, {}> {
  static defaultProps = {
    mod: 'sk-range-slider',
    rangeFormatter: identity
  }

  constructor(props) {
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
    const { mod, className, step, marks, rangeFormatter, min, max, minValue, maxValue } = this.props

    const bemBlocks = {
      container: block(mod).el
    }

    return (
      <div className={bemBlocks.container().mix(className)}>
        <Range
          min={min}
          max={max}
          marks={
            marks || {
              [min]: rangeFormatter(min),
              [max]: rangeFormatter(max)
            }
          }
          tipFormatter={rangeFormatter}
          range={true}
          step={step}
          value={[minValue, maxValue]}
          onChange={this.onChange}
          onAfterChange={this.onFinished}
        />
      </div>
    )
  }
}
