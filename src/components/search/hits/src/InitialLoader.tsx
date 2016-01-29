import * as React from "react";
import "../styles/index.scss";

import {
	SearchkitComponent,
	SearchkitComponentProps,
	ReactComponentType
} from "../../../../core"


const renderInitialView:React.StatelessComponent<any> = (props)=> (
	<div className={props.bemBlocks.container()}>
		<div data-qa="initial-loading" className={props.bemBlocks.container("initial-loading")}></div>
	</div>
)
export interface InitialLoaderprops extends SearchkitComponentProps{
	component?:ReactComponentType
}

export class InitialLoader extends SearchkitComponent<InitialLoaderprops, any> {
  defineBEMBlocks() {
		let block = (this.props.mod || "initial-loader")
		return {
			container: block
		}
	}
  render(){
    let initialViewComponent = this.props.component || renderInitialView
    if(this.isInitialLoading()){
      return React.createElement(initialViewComponent, {bemBlocks:this.bemBlocks})
    }
    return null
  }
}
