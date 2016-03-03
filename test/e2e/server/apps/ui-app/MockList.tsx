import * as React from "react";
const {
  Panel
} = require("../../../../../src")

const _ = require("lodash")

export class MockList extends React.Component<any, any>{

  constructor(props){
    super(props)
    let self = this
    this.state = {
      items:[
        {key:"a", label:"A", doc_count:10},
        {key:"b", label:"B", doc_count:11},
        {key:"c", title:"C", doc_count:12},
        {key:"d", doc_count:15},
      ],
      selectedItems:["a", "c"],
      toggleItem(key){
        if(_.includes(self.state.selectedItems, key)){
          self.setState({selectedItems:_.without(self.state.selectedItems, key)})
        } else {
          self.setState({selectedItems:self.state.selectedItems.concat([key])})
        }
      },
      setItems(items){
        self.setState({items:items})
      },
      translate(key){
        return key + " translated"
      }
    }
  }

  render(){
    return (
      <Panel title={this.props.title}>
        {React.createElement(this.props.listComponent, this.state)}
      </Panel>
    )
  }

}
