import * as React from "react";
import "../styles/index.scss";
import {
	SearchkitComponent,
	SearchkitComponentProps,
	ReactComponentType
} from "../../../../core"

const defaults = require("lodash/defaults")


const renderInitialView:React.StatelessComponent<any> = (props)=> (
	<div className={props.bemBlocks.container()}>
		<div data-qa="initial-loading" className={props.bemBlocks.container("initial-loading")}></div>
	</div>
)
export interface InitialLoaderprops extends SearchkitComponentProps{
	component?:ReactComponentType<any>
}

export class InitialLoader extends SearchkitComponent<InitialLoaderprops, any> {
	static defaultProps = {
		component:renderInitialView
	}
	static propTypes = defaults({
		component:React.PropTypes.func
	}, SearchkitComponent.propTypes)

	defineBEMBlocks() {
		let block = (this.props.mod || "initial-loader")
		return {
			container: block
		}
	}
  render(){
    if(this.isInitialLoading()){
      return React.createElement(this.props.component, {
				bemBlocks:this.bemBlocks
			})
    }
    return null
  }
}
