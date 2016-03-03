import * as React from "react";
const {
  Panel
} = require("../../../../../src")

const _ = require("lodash")

export class MockRange extends React.Component<any, any>{

  constructor(props) {
    super(props)
    let self = this
    this.state = {
      items: [
        { key: 0, doc_count: 0 },
        { key: 1, doc_count: 4 },
        { key: 2, doc_count: 5 },
        { key: 3, doc_count: 6 },
        { key: 4, doc_count: 7 },
        { key: 5, doc_count: 8 },
        { key: 6, doc_count: 0 },
        { key: 7, doc_count: 10 },
        { key: 8, doc_count: 4 },
        { key: 9, doc_count: 2 },
        { key: 10, doc_count: 0 },
      ],
      min: 0, max: 10,
      minValue: 2, maxValue: 5,
      onChange([minValue, maxValue]) {
        self.setState({
          minValue, maxValue
        })
      },
      onFinished([minValue, maxValue]) {
        self.setState({
          minValue, maxValue
        })
        console.log("Set range to ", minValue, ", ", maxValue)
      }
    }
  }

  render() {
    return (
      <Panel title={this.props.title}>
        {React.createElement(this.props.rangeComponent, this.state) }
        </Panel>
    )
  }

}
