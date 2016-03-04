
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
  translate?: (string) => string
}

