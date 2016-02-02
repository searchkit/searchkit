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
	resetFilters:Function,
	translate:Function,
  selected:Boolean,
  label:string,
  count: number
}

export class FilterItemComponent extends React.Component<FilterItemComponentProps, any>{
	render(){
		const {bemBlocks, toggleFilter, translate, resetFilters, selected, label, count} = this.props
    const className = bemBlocks.option()
											.state({selected})
											.mix(bemBlocks.container("item"))

		return (
      <FastClick handler={toggleFilter} key={label}>
				<div className={className}>
					<div className={bemBlocks.option("text")}>{label}</div>
					<div className={bemBlocks.option("count")}>{count}</div>
				</div>
			</FastClick>
		)
	}
}
