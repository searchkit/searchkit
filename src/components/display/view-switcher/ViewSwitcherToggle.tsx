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
  changeView(view){
    let viewOptionsAccessor = this.getViewOptionsSwitcherAccessor()
    if(view.defaultOption){
      viewOptionsAccessor.state = viewOptionsAccessor.state.clear()
    } else {
      viewOptionsAccessor.state = viewOptionsAccessor.state.setValue(view.key)
    }

    //this won't fire search as query didn't change, but it will serialize url
    //might need better way
    this.searchkit.performSearch(false, false)
    this.searchkit.emitter.trigger()
  }

  render() {
    let viewOptionsAccessor = this.getViewOptionsSwitcherAccessor()
    if(this.hasHits() && viewOptionsAccessor){
      let options = viewOptionsAccessor.options
      let selectedOption = viewOptionsAccessor.getSelectedOption()
      const actions = map(options, (option) => {
        return React.createElement(ViewItemComponent, {
          view:option.title,
          setView: ()=> this.changeView(option),
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
