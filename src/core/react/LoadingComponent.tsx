import * as React from "react";
import {SearchkitComponent, SearchkitComponentProps} from "./SearchkitComponent"

export interface LoadingProps extends SearchkitComponentProps {
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
