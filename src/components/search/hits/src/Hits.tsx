import * as React from "react";

import {
	SearchkitComponent,
	PageSizeAccessor,
	ImmutableQuery,
	HighlightAccessor,
	SearchkitComponentProps,
	ReactComponentType,
	PureRender,
	SourceFilterType,
	SourceFilterAccessor
} from "../../../../core"

const map = require("lodash/map")
const defaults = require("lodash/defaults")


export interface HitItemProps {
	key:string
	bemBlocks?:any
	result:Object
	index:number
}

@PureRender
export class HitItem extends React.Component<HitItemProps, any> {
	render(){
		return (
			<div data-qa="hit" className={this.props.bemBlocks.item().mix(this.props.bemBlocks.container("item"))}>
			</div>
		)
	}
}

export interface HitsProps extends SearchkitComponentProps{
	hitsPerPage: number
	highlightFields?:Array<string>
	sourceFilter?:SourceFilterType
	itemComponent?:ReactComponentType<HitItemProps>
	scrollTo?: boolean|string
}


export class Hits extends SearchkitComponent<HitsProps, any> {

	static propTypes = defaults({
		hitsPerPage:React.PropTypes.number.isRequired,
		highlightFields:React.PropTypes.arrayOf(
			React.PropTypes.string
		),
		sourceFilterType:React.PropTypes.oneOf([
			React.PropTypes.string,
			React.PropTypes.arrayOf(React.PropTypes.string),
			React.PropTypes.bool
		]),
		itemComponent:React.PropTypes.func
	}, SearchkitComponent.propTypes)

	static defaultProps = {
		itemComponent:HitItem,
		scrollTo: "body"
	}

	componentWillMount() {
		super.componentWillMount()
		if(this.props.highlightFields) {
			this.searchkit.addAccessor(
				new HighlightAccessor(this.props.highlightFields))
		}
		if(this.props.sourceFilter){
			this.searchkit.addAccessor(
				new SourceFilterAccessor(this.props.sourceFilter)
			)
		}
	}

	componentDidUpdate() {
		if(!!this.props.scrollTo && !this.isLoading() && this.hasHitsChanged()) {
			const scrollSelector:string = (this.props.scrollTo == true) ? "body" : this.props.scrollTo.toString()
			document.querySelector(scrollSelector).scrollTop = 0;
		}
	}

	defineAccessor(){
		return new PageSizeAccessor(this.props.hitsPerPage)
	}

	defineBEMBlocks() {
		let block = (this.props.mod || "sk-hits")
		return {
			container: block,
			item: `${block}-hit`
		}
	}

	renderResult(result:any, index:number) {
		return React.createElement(this.props.itemComponent, {
			key:result._id, result, bemBlocks:this.bemBlocks, index:index
		})
	}

	render() {
		let hits:Array<Object> = this.getHits()
		let hasHits = hits.length > 0

		if (!this.isInitialLoading() && hasHits) {
			return (
				<div data-qa="hits" className={this.bemBlocks.container()}>
				{map(hits, this.renderResult.bind(this))}
				</div>
			);
		}

		return null

	}
}
