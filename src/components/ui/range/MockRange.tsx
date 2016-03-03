import * as React from "react";
const assign = require("lodash/assign")

export class MockRange extends React.Component<any, any> {

  constructor(props){
    super(props)
    this.state = {
      items: [
        { key: 3, doc_count: 10 },
        { key: 4, doc_count: 11 },
        { key: 5, doc_count: 12 },
        { key: 6, doc_count: 0 },
        { key: 7, doc_count: 13 }
      ],
      min: 0, max: 10,
      minValue: 2, maxValue: 5,
      onChange: jasmine.createSpy("onChange"),
      onFinished: jasmine.createSpy("onFinished")
    }
  }

  render(){
    return React.createElement(
      this.props.rangeComponent,
      assign({}, this.state, this.props)
    )
  }
}
