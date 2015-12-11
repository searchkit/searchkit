import * as React from "react";

export class FastClick extends React.Component<any, any>{

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
