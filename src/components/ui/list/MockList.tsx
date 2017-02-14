import * as React from "react";
import {assign} from "lodash"

export class MockList extends React.Component<any, any> {

  constructor(props){
    super(props)
    this.state = {
      items:[
        {key:"a", label:"A", doc_count:10},
        {key:"b", label:"B", doc_count:11, disabled:true},
        {key:"c", title:"C", doc_count:12},
        {key:"d", doc_count:15},
      ],
      docCount: 10+11+12+15,
      selectedItems:["a", "c"],
      toggleItem:jasmine.createSpy("toggleItem"),
      setItems:jasmine.createSpy("setItems"),
      translate(key){
        return key + " translated"
      },
      countFormatter:(count)=> "#"+count
    }
  }

  render(){
    return React.createElement(
      this.props.listComponent,
      assign({}, this.state, this.props)
    )
  }
}
