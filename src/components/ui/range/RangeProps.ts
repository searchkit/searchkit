import * as React from "react";

const PropTypes = React.PropTypes

export interface RangeProps {
  onChange: (range:{min: number, max: number}) => void
  onFinished: (range:{min: number, max: number}) => void
  min: number
  max: number
  minValue?: number
  maxValue?: number
  items: Array<any>
  disabled?: boolean
  mod?: string
  className?: string
  translate?: (s: string) => string
}

export const RangePropTypes = {
  onChange:PropTypes.func.isRequired,
  onFinishd:PropTypes.func.isRequired,
  min:PropTypes.number.isRequired,
  max:PropTypes.number.isRequired,
  minValue:PropTypes.number,
  maxValue:PropTypes.number,
  items:PropTypes.array,
  disabled:PropTypes.bool,
  mod:PropTypes.string,
  className:PropTypes.string,
  translate:PropTypes.func
}
