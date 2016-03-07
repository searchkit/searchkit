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
	SourceFilterAccessor,
	HitsAccessor,
	RenderComponentType,
	RenderComponentPropType,
	renderComponent
} from "../../../../core"

const map = require("lodash/map")
const defaults = require("lodash/defaults")


export interface HitItemProps {
	key:string,
	bemBlocks?:any,
	result:Object
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

export interface HitsListProps{
	bemBlocks?:{item?:any, container?:any},
	itemComponent?:RenderComponentType<HitItemProps>,
	hits:Array<Object>
}

export class HitsList extends React.Component<HitsListProps, any>{
	render(){
		return (
			<div data-qa="hits" className={this.props.bemBlocks.container()}>
				{map(this.props.hits, (result, index)=> {
					return renderComponent(this.props.itemComponent, {
						key:result._id, result, bemBlocks:this.props.bemBlocks, index
					})
				})}
			</div>
		)
	}
}

export interface HitsProps extends SearchkitComponentProps{
	hitsPerPage: number
	highlightFields?:Array<string>
	sourceFilter?:SourceFilterType
	itemComponent?:ReactComponentType<HitItemProps>
	listComponent?:ReactComponentType<HitsListProps>
	scrollTo?: boolean|string
}


export class Hits extends SearchkitComponent<HitsProps, any> {
	hitsAccessor:HitsAccessor

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
		itemComponent:RenderComponentPropType,
		listComponent:RenderComponentPropType
	}, SearchkitComponent.propTypes)

	static defaultProps = {
		itemComponent:HitItem,
		listComponent:HitsList,
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
		this.hitsAccessor = new HitsAccessor({ scrollTo:this.props.scrollTo })
		this.searchkit.addAccessor(this.hitsAccessor)
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
			key:result._id, result, bemBlocks:this.bemBlocks, index
		})
	}

	render() {
		let hits:Array<Object> = this.getHits()
		let hasHits = hits.length > 0

		if (!this.isInitialLoading() && hasHits) {
			return renderComponent(this.props.listComponent, {
				hits,
				bemBlocks:this.bemBlocks,
				itemComponent:this.props.itemComponent
			})
		}

		return null

	}
}
