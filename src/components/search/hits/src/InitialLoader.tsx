import * as React from "react";

import {
	SearchkitComponent,
	SearchkitComponentProps,
	ReactComponentType,
	PureRender,
  renderComponent
} from "../../../../core"

import {defaults} from "lodash"

export interface InitialViewDisplayProps {
	bemBlocks:any
}

@PureRender
export class  InitialViewDisplay extends React.Component<InitialViewDisplayProps, any>{
	render(){
		return (
	 		<div className={this.props.bemBlocks.container()}>
	 			<div data-qa="initial-loading" className={this.props.bemBlocks.container("initial-loading")}></div>
	 		</div>
	 	)
	}
}


export interface InitialLoaderprops extends SearchkitComponentProps{
	component?:ReactComponentType<InitialViewDisplayProps>
}

export class InitialLoader extends SearchkitComponent<InitialLoaderprops, any> {
	static defaultProps = {
		component:InitialViewDisplay
	}
	static propTypes = defaults({
		component:React.PropTypes.func
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
