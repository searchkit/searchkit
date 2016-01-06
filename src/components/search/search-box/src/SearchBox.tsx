import * as React from "react";
import * as _ from "lodash"

var Autosuggest = require('react-autosuggest');

import "../styles/index.scss";

import {
	SearchAccessor,
	SearchkitComponent
} from "../../../../core"

export interface ISearchBox {
	searchOnChange?:boolean
	prefixQueryFields?:Array<string>
	queryFields?:Array<string>
	mod?:string
	autofocus?:boolean
}

export class SearchBox extends SearchkitComponent<ISearchBox, any> {
	accessor:SearchAccessor
	lastSearchMs:number
	constructor (props:ISearchBox) {
		super(props);
		this.state = {
			focused:false
		}
		this.lastSearchMs = 0
	}

	componentWillMount() {
		super.componentWillMount()
	}

	defineBEMBlocks() {
		return {container:(this.props.mod || "search-box")};
	}

	defineAccessor(){
		return new SearchAccessor("q", {
			prefixQueryFields:this.props.prefixQueryFields,
			queryFields:this.props.queryFields
		})
	}

	onSubmit(event) {
		event.preventDefault()
		this.searchQuery(this.getValue())
	}

	searchQuery(query) {
		this.searchkit.resetState()
		this.accessor.state = this.accessor.state.setValue(query)
		let now = +new Date
		let newSearch = now - this.lastSearchMs <= 2000
		this.lastSearchMs = now
		this.searchkit.performSearch(newSearch)
	}

	getValue(){
		return (this.accessor.state.getValue() || "") + ""
	}

	onChange(e){
		const query = e.target.value;
		this.accessor.state = this.accessor.state.setValue(query)
		if (this.props.searchOnChange) {
			_.throttle(()=> {
				this.searchQuery(this.accessor.state.getValue())
			}, 400)()
		}
		this.forceUpdate()
	}

	setFocusState(focused:boolean) {
		this.setState({focused:focused})
	}

	render() {
		let block = this.bemBlocks.container

		return (
			<div className={block().state({focused:this.state.focused})}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className={block("icon")}></div>
          <input type="text"
					data-qa="query"
					className={block("text")}
					placeholder="search"
					value={this.getValue()}
					onFocus={this.setFocusState.bind(this, true)}
					onBlur={this.setFocusState.bind(this, false)}
					ref="queryField"
					autoFocus={this.props.autofocus}
					onInput={this.onChange.bind(this)}/>
          <input type="submit" value="search" className={block("action")} data-qa="submit"/>
					<div data-qa="loader" className={block("loader").mix("sk-spinning-loader").state({hidden:!this.isLoading()})}></div>
        </form>
      </div>
		);

	}
}
