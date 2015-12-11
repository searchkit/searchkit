import * as React from "react";

export interface FastClickProps {
	handler:Function
	children?:any
}

export class FastClick extends React.Component<FastClickProps, any>{

  render(){
    return React.cloneElement(this.props.children, {
      onMouseDown:(event)=>{
        if(event.button === 0){
          this.props.handler()
        }
      }
    })
  }

}
