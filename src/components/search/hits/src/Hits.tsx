import * as React from "react";

import {
	SearchkitComponent,
	PageSizeAccessor,
	ImmutableQuery,
	HighlightAccessor,
	CustomHighlightAccessor,
	SearchkitComponentProps,
	ReactComponentType,
	PureRender,
	SourceFilterType,
	SourceFilterAccessor,
	HitsAccessor,
	RenderComponentType,
	RenderComponentPropType,
	renderComponent,
	block
} from "../../../../core"

import {map} from "lodash"
import {defaults} from "lodash"



export interface HitItemProps {
	key:string,
	bemBlocks?:any,
	result:any
}

@PureRender
export class HitItem extends React.Component<HitItemProps, any> {

	render(){
		return (
			<div data-qa="hit"
				className={this.props.bemBlocks.item().mix(this.props.bemBlocks.container("item"))}>
				{this.props.result._id}
			</div>
		)
	}
}

export interface HitsListProps{
	mod?:string,
	className?:string,
	itemComponent?:RenderComponentType<HitItemProps>,
	hits:Array<Object>
}

@PureRender
export class HitsList extends React.Component<HitsListProps, any>{

	static defaultProps={
		mod:"sk-hits",
		itemComponent:HitItem
	}

	static propTypes = {
		mod:React.PropTypes.string,
		className:React.PropTypes.string,
		itemComponent:RenderComponentPropType,
		hits:React.PropTypes.any
	}

	render(){
		const {hits, mod, className, itemComponent} = this.props
		const bemBlocks = {
			container: block(mod),
			item: block(`${mod}-hit`)
		}
		return (
			<div data-qa="hits" className={bemBlocks.container().mix(className)}>
				{map(hits, (result: any, index)=> {
					return renderComponent(itemComponent, {
						key:result._id, result, bemBlocks, index
					})
				})}
			</div>
		)
	}
}

export interface HitsProps extends SearchkitComponentProps{
	hitsPerPage: number
	highlightFields?:Array<string>
	customHighlight?:any
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
		listComponent:HitsList,
		scrollTo: "body"
	}

	componentWillMount() {
		super.componentWillMount()
		if(this.props.highlightFields) {
			this.searchkit.addAccessor(
				new HighlightAccessor(this.props.highlightFields))
		}
		if (this.props.customHighlight) {
			this.searchkit.addAccessor(new CustomHighlightAccessor(this.props.customHighlight))
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

	render() {
		let hits:Array<Object> = this.getHits()
		let hasHits = hits.length > 0

		if (!this.isInitialLoading() && hasHits) {
			const {listComponent, mod, className, itemComponent} = this.props
			return renderComponent(listComponent, {
				hits, mod, className, itemComponent
			})
		}

		return null

	}
}
