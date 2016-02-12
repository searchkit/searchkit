import * as React from "react";

import {
	SearchkitComponent,
	FacetAccessor,
	FastClick,
	SearchkitComponentProps,
	ReactComponentType,
	PureRender
} from "../../../../../core"

export interface FilterItemComponentProps {
	bemBlocks:{container:any, option:any},
	toggleFilter:Function,
	translate:Function,
  selected:boolean,
  label:string,
  count: number
}

function itemRenderer(props:FilterItemComponentProps, showCheckbox) {
  const {bemBlocks, toggleFilter, translate, selected, label, count} = props
  const block = bemBlocks.option
  const className = block()
                    .state({selected})
                    .mix(bemBlocks.container("item"))
  return (
    <FastClick handler={toggleFilter}>
      <div className={className} data-qa="option">
        {showCheckbox ? <input type="checkbox" data-qa="checkbox" checked={selected} readOnly className={block("checkbox").state({ selected }) } ></input> : undefined}
        <div data-qa="label" className={block("text")}>{label}</div>
        <div data-qa="count" className={block("count")}>{count}</div>
      </div>
    </FastClick>
  )
}

@PureRender
export class FilterItemComponent extends React.Component<FilterItemComponentProps, any>{
	render(){
    return itemRenderer(this.props, false)
	}
}

@PureRender
export class FilterCheckboxItemComponent extends React.Component<FilterItemComponentProps, any>{
	render(){
    return itemRenderer(this.props, true)
	}
}
