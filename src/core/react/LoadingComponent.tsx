import * as React from "react";
import {SearchkitComponent} from "./SearchkitComponent"

export interface LoadingProps {
  children?:any
}

export class LoadingComponent extends SearchkitComponent<LoadingProps, any> {

	render(){
    if(this.isLoading()) {
      return this.props.children
    }
    return <div/>
	}
}
