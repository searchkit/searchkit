import * as React from "react";
const Rcslider = require("rc-slider")

const block = require('bem-cn')

export class RangeSlider extends React.Component<any, {}> {

  static defaultProps = {
    mod: "sk-range-slider",
  }

  render() {
    const { mod, className,
      min, max, minValue, maxValue,
      onChange, onFinished } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    return (
      <div className={bemBlocks.container().mix(className)}>
        <Rcslider
          min={min}
          max={max}
          marks={{ [min]: min, [max]: max }}
          range={true}
          value={[minValue, maxValue]}
          onChange={onChange}
          onAfterChange={onFinished}/>
      </div>
    )
  }
}
