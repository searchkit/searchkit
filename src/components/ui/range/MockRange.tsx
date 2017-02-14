import * as React from "react";
import {assign} from "lodash"

export class MockRange extends React.Component<any, any> {

  constructor(props){
    super(props)
    this.state = {
      items: [
        { key: 0, doc_count: 0 },
        { key: 1, doc_count: 0 },
        { key: 2, doc_count: 0 },
        { key: 3, doc_count: 6 },
        { key: 4, doc_count: 7 },
        { key: 5, doc_count: 8 },
        { key: 6, doc_count: 0 },
        { key: 7, doc_count: 10 },
        { key: 8, doc_count: 0 },
        { key: 9, doc_count: 0 },
        { key: 10, doc_count: 0 },
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
