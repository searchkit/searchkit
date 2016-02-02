import * as React from "react";

import {
	SearchkitComponent,
	FacetAccessor,
	FastClick,
	SearchkitComponentProps,
	ReactComponentType
} from "../../../../../core"

export interface FilterItemComponentProps {
	bemBlocks:{container:any, option:any},
	toggleFilter:Function,
	translate:Function,
  selected:Boolean,
  label:string,
  count: number
}

export class FilterItemComponent extends React.Component<FilterItemComponentProps, any>{
	render(){
		const {bemBlocks, toggleFilter, translate, selected, label, count} = this.props
    const className = bemBlocks.option()
											.state({selected})
											.mix(bemBlocks.container("item"))

		return (
      <FastClick handler={toggleFilter}>
				<div className={className} data-qa="option">
					<div data-qa="label" className={bemBlocks.option("text")}>{label}</div>
					<div data-qa="count" className={bemBlocks.option("count")}>{count}</div>
				</div>
			</FastClick>
		)
	}
}

export class FilterCheckboxItemComponent extends React.Component<FilterItemComponentProps, any>{
	render(){
    const {bemBlocks, toggleFilter, translate, selected, label, count} = this.props
    const className = bemBlocks.option()
											.state({selected})
											.mix(bemBlocks.container("item"))
    const block = bemBlocks.option

		return (
      <FastClick handler={toggleFilter}>
        <div className={className} data-qa="option">
          <div data-qa="checkbox" className={block("checkbox").state({ selected }) }></div>
          <div data-qa="label" className={block("text") }>{label}</div>
          <div data-qa="count" className={block("count") }>{count}</div>
        </div>
      </FastClick>
		)
	}
}
