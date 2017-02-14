import * as React from 'react'

import {
  RangeHistogram, RangeSlider, RangeInput
} from './'
import { PureRender } from "../../../core"
import {defaults} from "lodash"

@PureRender
export class RangeComponent extends React.Component<any, {}> {
  static propTypes = {
    showHistogram:React.PropTypes.bool,
    showSlider:React.PropTypes.bool,
    showInput:React.PropTypes.bool
  }

  render() {
    const { showHistogram, showSlider, showInput } = this.props
    return (
      <div>
        {showHistogram ? <RangeHistogram {...this.props} /> : undefined}
        {showSlider ? <RangeSlider {...this.props} /> : undefined}
        {showInput ? <RangeInput {...this.props} /> : undefined}
      </div>
    )
  }
}

export function RangeComponentBuilder(components) {
  return (props) => <RangeComponent {...props} {...components} />
}

export const RangeSliderHistogram = RangeComponentBuilder({showHistogram: true, showSlider: true})
export const RangeSliderHistogramInput = RangeComponentBuilder({showHistogram: true, showSlider: true, showInput: true})
export const RangeSliderInput = RangeComponentBuilder({showSlider: true, showInput: true})
export const RangeHistogramInput = RangeComponentBuilder({showHistogram: true, showInput: true})
