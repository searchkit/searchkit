import * as React from 'react'
import * as PropTypes from 'prop-types'

import { RangePropTypes } from './RangeProps'
import { RangeHistogram, RangeSlider, RangeInput } from './'

export class RangeComponent extends React.PureComponent<any, {}> {
  static propTypes = {
    showHistogram: PropTypes.bool,
    showSlider: PropTypes.bool,
    showInput: PropTypes.bool,
    ...RangePropTypes
  }

  render() {
    const props: any = this.props
    const { showHistogram, showSlider, showInput } = props
    return (
      <div>
        {showHistogram ? <RangeHistogram {...props} /> : undefined}
        {showSlider ? <RangeSlider {...props} /> : undefined}
        {showInput ? <RangeInput {...props} /> : undefined}
      </div>
    )
  }
}

export function RangeComponentBuilder(components) {
  return (props) => <RangeComponent {...props} {...components} />
}

export const RangeSliderHistogram = RangeComponentBuilder({ showHistogram: true, showSlider: true })
export const RangeSliderHistogramInput = RangeComponentBuilder({
  showHistogram: true,
  showSlider: true,
  showInput: true
})
export const RangeSliderInput = RangeComponentBuilder({ showSlider: true, showInput: true })
export const RangeHistogramInput = RangeComponentBuilder({ showHistogram: true, showInput: true })
