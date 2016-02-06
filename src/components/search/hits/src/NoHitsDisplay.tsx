import * as React from "react";
import {
	FastClick
} from "../../../../core"

export interface NoHitsDisplayProps {
	noResultsLabel:string
  resetFiltersFn: Function
	setSuggestionFn: Function
  translate: Function
	bemBlocks: {container:Function}
	suggestion: string
	query: string
	filtersCount: number
}

export class NoHitsDisplay extends React.Component<NoHitsDisplayProps, any> {

	getSuggestionAction() {
		const {suggestion, setSuggestionFn, bemBlocks, translate} = this.props

		if(suggestion){
			return (
				<FastClick handler={setSuggestionFn}>
					<div className={bemBlocks.container("step-action")}>
						{translate("NoHits.DidYouMean", {suggestion})}
					</div>
				</FastClick>
			)
		}
		return null
	}

	getResetFilterAction() {
		const {filtersCount, query, resetFiltersFn, bemBlocks, translate} = this.props

		if(filtersCount > 0){
			return (
				<FastClick handler={resetFiltersFn}>
					<div className={bemBlocks.container("step-action")}>
						{translate("NoHits.SearchWithoutFilters",{query})}
					</div>
				</FastClick>
			)
		}
		return null
	}

  render() {
		const {bemBlocks, query, suggestion, noResultsLabel} = this.props
		return (
			<div data-qa="no-hits" className={bemBlocks.container()}>
				<div className={bemBlocks.container("info")}>
					{noResultsLabel}
				</div>
				<div className={bemBlocks.container("steps")}>
					{this.getSuggestionAction() || this.getResetFilterAction()}
				</div>
			</div>
		);
  }

}
