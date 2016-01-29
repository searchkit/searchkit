import * as React from "react";
import "../styles/index.scss";

import {
	SearchkitComponent,
	SearchkitComponentProps
} from "../../../../core"


const renderInitialView = ({bemBlocks})=> {
  return <div data-qa="initial-loading" className={bemBlocks.container("initial-loading")}></div>
}

export interface InitialLoaderprops extends SearchkitComponentProps{
	component?:any
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
