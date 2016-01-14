import * as React from "react";
import * as _ from "lodash"

var Autosuggest = require('react-autosuggest');

import "../styles/index.scss";

import {
	SearchAccessor,
	SearchkitComponent,
	SearchkitComponentProps
} from "../../../../core"

export interface SearchBoxProps extends SearchkitComponentProps {
	searchOnChange?:boolean
	queryFields?:Array<string>
	autofocus?:boolean
	queryOptions?:any
	prefixQueryFields?:Array<string>
}

export class SearchBox extends SearchkitComponent<SearchBoxProps, any> {
	accessor:SearchAccessor
	lastSearchMs:number

	translations = {
		"searchbox.placeholder":"Search"
	}

	static propTypes = _.defaults({
		searchOnChange:React.PropTypes.bool,
		queryFields:React.PropTypes.arrayOf(React.PropTypes.string),
		autofocus:React.PropTypes.bool,
		queryOptions:React.PropTypes.object,
		prefixQueryFields:React.PropTypes.arrayOf(React.PropTypes.string),
		translations:React.PropTypes.shape({
			"searchbox.placeholder":React.PropTypes.string
		})
	}, SearchkitComponent.propTypes)

	constructor (props:SearchBoxProps) {
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
			prefixQueryFields:this.props.prefixQueryFields || (this.props.searchOnChange && this.props.queryFields),
			queryFields:this.props.queryFields,
			queryOptions:_.extend({
			}, this.props.queryOptions)
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
					placeholder={this.translate("searchbox.placeholder")}
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
