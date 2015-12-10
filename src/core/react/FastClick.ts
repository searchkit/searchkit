import * as React from "react";
var cloneWithProps = require('react-addons-clone-with-props')

export interface FastClickProps {
	handler:Function
	children?:any
}

export class FastClick extends React.Component<FastClickProps, any>{

  render(){
    return cloneWithProps(this.props.children, {
      onMouseDown:(event)=>{
        if(event.button === 0){
          this.props.handler()
        }
      }
    })
  }

}
