import * as React from "react";
import * as PropTypes from "prop-types";

import {
	SearchkitComponent,
	SearchkitComponentProps,
	RenderComponentType,
  renderComponent
} from "../../../../core"

const defaults = require("lodash/defaults")

export interface InitialViewDisplayProps {
	bemBlocks:any
}

export class InitialViewDisplay extends React.PureComponent<InitialViewDisplayProps, any>{
	render(){
		return (
	 		<div className={this.props.bemBlocks.container()}>
	 			<div data-qa="initial-loading" className={this.props.bemBlocks.container("initial-loading")}></div>
	 		</div>
	 	)
	}
}


export interface InitialLoaderprops extends SearchkitComponentProps{
	component?: RenderComponentType<InitialViewDisplayProps>
}

export class InitialLoader extends SearchkitComponent<InitialLoaderprops, any> {
	static defaultProps = {
		component:InitialViewDisplay
	}
	static propTypes = defaults({
		component:PropTypes.func
	}, SearchkitComponent.propTypes)

	defineBEMBlocks() {
		let block = (this.props.mod || "sk-initial-loader")
		return {
			container: block
		}
	}
  render(){
    if(this.isInitialLoading()){
      return renderComponent(this.props.component, {
				bemBlocks:this.bemBlocks
			})
    }
    return null
  }
}
