import * as React from "react";

import {
	SearchkitComponent,
	SearchkitComponentProps,
	ReactComponentType,
  renderComponent
} from "../../../../core"

import {defaults} from "lodash"
import {get} from "lodash"
import {identity} from "lodash"

export interface HitsStatsDisplayProps {
	bemBlocks:{container: Function}
	resultsFoundLabel: string
	timeTaken:string|number
	hitsCount:string|number
	translate:Function
}

const HitsStatsDisplay = (props:HitsStatsDisplayProps) => {
	const {resultsFoundLabel, bemBlocks} = props
	return (
		<div className={bemBlocks.container()} data-qa="hits-stats">
			<div className={bemBlocks.container("info")} data-qa="info">
				{resultsFoundLabel}
			</div>
	  </div>
	)
}


export interface HitsStatsProps extends SearchkitComponentProps {
	component?: ReactComponentType<HitsStatsDisplayProps>
	countFormatter?:(count:number)=> number | string
}

export class HitsStats extends SearchkitComponent<HitsStatsProps, any> {

	static translations:any = {
		"hitstats.results_found":"{hitCount} results found in {timeTaken}ms"
	}
	translations = HitsStats.translations

	static propTypes = defaults({
		translations:SearchkitComponent.translationsPropType(
			HitsStats.translations
		),
		countFormatter:React.PropTypes.func
	}, SearchkitComponent.propTypes)

	static defaultProps = {
		component: HitsStatsDisplay,
		countFormatter:identity
	}

	defineBEMBlocks() {
		return {
			container: (this.props.mod || "sk-hits-stats")
		}
	}

	render() {
		const timeTaken = this.searchkit.getTime()
		const {countFormatter} = this.props
		const hitsCount = countFormatter(this.searchkit.getHitsCount())
		const props: HitsStatsDisplayProps = {
			bemBlocks:this.bemBlocks,
			translate:this.translate,
			timeTaken: timeTaken,
			hitsCount: hitsCount,
			resultsFoundLabel: this.translate("hitstats.results_found", {
				timeTaken:timeTaken,
				hitCount:hitsCount
			})
		}
		return renderComponent(this.props.component, props)
	}
}
