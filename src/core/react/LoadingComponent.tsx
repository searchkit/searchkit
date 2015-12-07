import * as React from "react";
import * as Rx from "rx"
import {SearchkitComponent} from "./SearchkitComponent"

export interface LoadingProps {
  children?:any
}

export class LoadingComponent extends SearchkitComponent<LoadingProps, any> {
  loadingUnsubscribe:Rx.IDisposable

	componentWillMount(){
    super.componentWillMount()
		this.loadingUnsubscribe = this.searchkit.loadingListener.subscribe(
			()=> this.forceUpdate()
		)
	}

	componentWillUnmount(){
		this.loadingUnsubscribe.dispose()
	}

	render(){
    if(this.searchkit.loading) {
      return this.props.children
    }
    return <div/>
	}
}
