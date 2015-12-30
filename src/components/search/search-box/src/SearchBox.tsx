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
}

export class SearchBox extends SearchkitComponent<ISearchBox, any> {
	accessor:SearchAccessor

	constructor (props:ISearchBox) {
		super(props);
		this.state = {
			focused:false
		}
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
		this.searchkit.performSearch()
	}

	getValue(){
		return (this.accessor.state.getValue() || "") + ""
	}

	onChange(e){
		const query = e.target.value;
		this.accessor.state = this.accessor.state.setValue(query)
		if (this.props.searchOnChange) {
			_.debounce(()=> {
				this.searchQuery(this.accessor.state.getValue())
			}, 200)()
		}
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
					className={block("text")}
					placeholder="search"
					defaultValue={this.getValue()}
					onFocus={this.setFocusState.bind(this, true)}
					onBlur={this.setFocusState.bind(this, false)}
					ref="queryField"
					onInput={this.onChange.bind(this)}/>
          <input type="submit" value="search" className={block("action")}/>
					<div className={block("loader").mix("sk-spinning-loader").state({hidden:!this.isLoading()})}></div>
        </form>
      </div>
		);

	}
}
