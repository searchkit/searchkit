import * as React from "react";
import * as PropTypes from "prop-types";

import {
  QueryAccessor,
  SearchkitComponent,
  SearchkitComponentProps
} from "../../../core"

import {defaults} from "lodash"
import {throttle} from "lodash"
import {assign} from "lodash"
import {isUndefined} from "lodash"

export interface SearchBoxProps extends SearchkitComponentProps {
  searchOnChange?:boolean
  searchThrottleTime?:number
  queryFields?:Array<string>
  queryBuilder?:Function
  queryOptions?:any
  autofocus?:boolean
  id?: string
  mod?: string
  placeholder?: string
  prefixQueryFields?:Array<string>
  prefixQueryOptions?:Object
  blurAction?:"search"|"restore"
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
    id: 'q',
    mod: 'sk-search-box',
    searchThrottleTime:200,
    blurAction: "search"
  }

  static propTypes = defaults({
    id:PropTypes.string,
    searchOnChange:PropTypes.bool,
    searchThrottleTime:PropTypes.number,
    queryBuilder:PropTypes.func,
    queryFields:PropTypes.arrayOf(PropTypes.string),
    autofocus:PropTypes.bool,
    queryOptions:PropTypes.object,
    prefixQueryFields:PropTypes.arrayOf(PropTypes.string),
    prefixQueryOptions:PropTypes.object,
    translations:SearchkitComponent.translationsPropType(
      SearchBox.translations
    ),
    mod: PropTypes.string,
    placeholder: PropTypes.string,
    blurAction: PropTypes.string
  }, SearchkitComponent.propTypes)

  constructor (props:SearchBoxProps) {
    super(props);
    this.state = {
      focused:false,
      input: undefined
    }
    this.lastSearchMs = 0
    this.throttledSearch = throttle(()=> {
      this.searchQuery(this.accessor.getQueryString())
    }, props.searchThrottleTime)
  }


  defineBEMBlocks() {
    return { container:this.props.mod };
  }

  defineAccessor(){
    const {
      id, prefixQueryFields, queryFields, queryBuilder,
      searchOnChange, queryOptions, prefixQueryOptions
    } = this.props
    return new QueryAccessor(id, {
      prefixQueryFields,
      prefixQueryOptions:assign({}, prefixQueryOptions),
      queryFields:queryFields || ["_all"],
      queryOptions:assign({}, queryOptions),
      queryBuilder,
      onQueryStateChange: () => {
        if (!this.unmounted && this.state.input){
          this.setState({input: undefined})
        }
      }
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
    const { input } = this.state
    if (isUndefined(input)) {
      return this.getAccessorValue()
    } else {
      return input
    }
  }

  getAccessorValue(){
    return (this.accessor.state.getValue() || "") + ""
  }

  onChange(e){
    const query = e.target.value;
    if (this.props.searchOnChange) {
      this.accessor.setQueryString(query)
      this.throttledSearch()
      this.forceUpdate()
    } else {
      this.setState({ input: query })
    }
  }

  setFocusState(focused:boolean) {
    if (!focused){
      const { input } = this.state
      if (this.props.blurAction == "search"
        && !isUndefined(input)
        && input != this.getAccessorValue()){
        this.searchQuery(input)
      }
      this.setState({
        focused,
        input: undefined // Flush (should use accessor's state now)
      })
    } else {
      this.setState({ focused })
    }
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
          placeholder={this.props.placeholder || this.translate("searchbox.placeholder")}
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
