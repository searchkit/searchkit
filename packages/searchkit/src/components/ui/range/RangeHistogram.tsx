import * as React from "react";

import { block } from "../../../core/react"


const maxBy = require("lodash/maxBy")
const map = require("lodash/map")

function computeMaxValue(items, field) {
  if (!items || items.length == 0) return 0
  return maxBy(items, field)[field]
}

export class RangeHistogram extends React.PureComponent<any, {}> {

  static defaultProps = {
    mod: 'sk-range-histogram'
  }

  render() {
    const { mod, className, minValue, maxValue, items = []} = this.props

    const bemBlocks = {
      container: block(mod).el
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
