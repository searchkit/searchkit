import * as React from "react";

import {
  QueryAccessor,
  SearchkitComponent,
  SearchkitComponentProps
} from "../../../../core"

const defaults = require("lodash/defaults")
const throttle = require("lodash/throttle")
const assign = require("lodash/assign")

export interface SearchBoxProps extends SearchkitComponentProps {
  searchOnChange?:boolean
  searchThrottleTime?:number
  queryFields?:Array<string>
  autofocus?:boolean
  queryOptions?:any
  prefixQueryFields?:Array<string>
}

export class SearchBox extends SearchkitComponent<SearchBoxProps, any> {
  accessor:QueryAccessor
  lastSearchMs:number
  throttledSearch: () => void

  static translations:any = {
    "searchbox.placeholder":"Search"
  }
  translations = SearchBox.translations

  static defaultProps = {
    searchThrottleTime:200
  }

  static propTypes = defaults({
    searchOnChange:React.PropTypes.bool,
    searchThrottleTime:React.PropTypes.number,
    queryFields:React.PropTypes.arrayOf(React.PropTypes.string),
    autofocus:React.PropTypes.bool,
    queryOptions:React.PropTypes.object,
    prefixQueryFields:React.PropTypes.arrayOf(React.PropTypes.string),
    translations:SearchkitComponent.translationsPropType(
      SearchBox.translations
    )
  }, SearchkitComponent.propTypes)

  constructor (props:SearchBoxProps) {
    super(props);
    this.state = {
      focused:false
    }
    this.lastSearchMs = 0
    this.throttledSearch = throttle(()=> {
      this.searchQuery(this.accessor.getQueryString())
    }, props.searchThrottleTime)
  }

  componentWillMount() {
    super.componentWillMount()
  }

  defineBEMBlocks() {
    return {container:(this.props.mod || "sk-search-box")};
  }

  defineAccessor(){

    return new QueryAccessor("q", {
      prefixQueryFields:(this.props.searchOnChange ? (this.props.prefixQueryFields || this.props.queryFields) : false),
      queryFields:this.props.queryFields || ["_all"],
      queryOptions:assign({
      }, this.props.queryOptions)
    })
  }

  onSubmit(event) {
    event.preventDefault()
    this.searchQuery(this.getValue())
  }

  searchQuery(query) {
    let shouldResetOtherState = false
    this.accessor.setQueryString(query, shouldResetOtherState )
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
    this.accessor.setQueryString(query)
    if (this.props.searchOnChange) {
      this.throttledSearch()
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
