import * as React from "react";
const {
  Panel,
  renderComponent
} = require("searchkit")

const includes = require("lodash/includes")
const without = require("lodash/without")


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
        if(includes(self.state.selectedItems, key)){
          self.setState({selectedItems:without(self.state.selectedItems, key)})
        } else {
          self.setState({selectedItems:self.state.selectedItems.concat([key])})
        }
      },
      setItems(items){
        self.setState({ selectedItems: items })
      },
      translate(key){
        return key + "!"
      }
    }
  }

  render(){
    return (
      <Panel title={this.props.title}>
        {renderComponent(this.props.listComponent, Object.assign({},  this.state, this.props))}
     </Panel>
    )
  }

}
