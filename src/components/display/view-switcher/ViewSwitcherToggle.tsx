import * as React from "react";
import {
	SearchkitComponent,
	SearchkitComponentProps,
	ViewOptionsAccessor
} from "../../../core"
import {Hits} from "../../"

const map = require("lodash/map")

const ViewItemComponent = (props) => {
  return (
    <div
      className={props.bemBlocks.container("action").state({active:props.isActive})}
      onClick={props.setView}>
      {props.view}
    </div>
  )
}

export class ViewSwitcherToggle extends SearchkitComponent<any, any> {

  defineBEMBlocks() {
    return {
      container:this.props.mod || "sk-view-switcher"
    }
  }

  getViewOptionsSwitcherAccessor(){
    return this.searchkit.getAccessorsByType(ViewOptionsAccessor)[0]
  }

  setView(view){
    this.getViewOptionsSwitcherAccessor().setView(view)
  }

  render() {
    let viewOptionsAccessor = this.getViewOptionsSwitcherAccessor()
    if(this.hasHits() && viewOptionsAccessor){
      let options = viewOptionsAccessor.options
      let selectedOption = viewOptionsAccessor.getSelectedOption()
      const actions = map(options, (option) => {
        return React.createElement(ViewItemComponent, {
          view:option.title,
          setView: ()=> this.setView(option),
          bemBlocks: this.bemBlocks,
          key:option.key,
          isActive: option == selectedOption
        })
      })

      return (
      <div className={this.bemBlocks.container()}>
        {actions}
      </div>)
    }
    return null

  }

}
