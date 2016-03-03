import * as React from "react";
const {
  Panel
} = require("../../../../../src")

const _ = require("lodash")

export class MockList extends React.Component<any, any>{

  constructor(props) {
    super(props)
    let self = this
    this.state = {
      items: [
        { key: 3, doc_count: 10 },
        { key: 4, doc_count: 11 },
        { key: 5, doc_count: 12 },
        { key: 6, doc_count: 0 },
        { key: 7, doc_count: 13 },
      ],
      min: 0, max: 10,
      minValue: 2, maxValue: 5
      onChange({min, max}){
        self.setState({
          minValue: min, maxValue: max
        })
      },
      onFinished({min, max}) {
        self.setState({
          minValue: min, maxValue: max
        })
        console.log("Set range to ", min, ", ", max)
      }
    }
  }

  render() {
    return (
      <Panel title={this.props.title}>
        {React.createElement(this.props.listComponent, this.state) }
        </Panel>
    )
  }

}
