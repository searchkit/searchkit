import * as React from "react";

import { PureRender } from "../../../"

let block = require("bem-cn")

import {maxBy} from "lodash"
import {map} from "lodash"

function computeMaxValue(items, field) {
  if (!items || items.length == 0) return 0
  return maxBy(items, field)[field]
}

@PureRender
export class RangeHistogram extends React.Component<any, {}> {

  static defaultProps = {
    mod: 'sk-range-histogram'
  }

  render() {
    const { mod, className, min, max, minValue, maxValue, items = []} = this.props

    const bemBlocks = {
      container: block(mod)
    }

    const maxCount = computeMaxValue(items, "doc_count")
    if (maxCount == 0) return null

    let bars = map(items, ({key, doc_count}) => {
      const outOfBounds = (key < minValue || key > maxValue)
      return (
        <div className={bemBlocks.container('bar').state({'out-of-bounds': outOfBounds})}
          key={key}
          style={{
            height: `${(doc_count / maxCount) * 100}%`
          }}>
          </div>
      )
    })

    return (
      <div className={bemBlocks.container().mix(className)}>
        {bars}
      </div>
    )
  }
}
