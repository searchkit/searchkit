import * as React from "react";

import {
  QueryAccessor,
  SearchkitComponent,
  SearchkitComponentProps,
  ReactComponentType
} from "../../../../core";

import { SearchBox } from "../../search-box/src/SearchBox"

import {
  Panel
} from "../../../ui"

const defaults = require('lodash/defaults')
const throttle = require("lodash/throttle")
const assign = require("lodash/assign")

export interface InputFilterProps extends SearchkitComponentProps {
  id: string
  title: string
  mod?: string
  searchOnChange?:boolean
  searchThrottleTime?:number
  queryFields?:Array<string>
  prefixQueryFields?:Array<string>
  queryOptions?:any
  placeholder?: string
  containerComponent?: ReactComponentType<any>
  collapsable?: boolean
}

export class InputFilter extends SearchkitComponent<InputFilterProps, any> {
  accessor:QueryAccessor
  lastSearchMs:number
  throttledSearch: () => void

  static translations:any = {
    "searchbox.placeholder":"Search"
  }
  translations = SearchBox.translations

  static defaultProps = {
    containerComponent: Panel,
    collapsable: false,
    mod: "sk-input-filter",
    searchThrottleTime:200
  }

  static propTypes = defaults({
    id:React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    searchOnChange:React.PropTypes.bool,
    searchThrottleTime:React.PropTypes.number,
    queryFields:React.PropTypes.arrayOf(React.PropTypes.string),
    queryOptions:React.PropTypes.object,
    prefixQueryFields:React.PropTypes.arrayOf(React.PropTypes.string),
    translations:SearchkitComponent.translationsPropType(
      SearchBox.translations
    ),
    mod: React.PropTypes.string,
    placeholder: React.PropTypes.string
  }, SearchkitComponent.propTypes)

  constructor (props:InputFilterProps) {
    super(props);
    this.state = {
      focused:false
    }
    this.lastSearchMs = 0
    this.onClear = this.onClear.bind(this)
    this.throttledSearch = throttle(()=> {
      this.searchQuery(this.accessor.getQueryString())
    }, props.searchThrottleTime)
  }

  componentWillMount() {
    super.componentWillMount()
  }

  defineBEMBlocks() {
    return { container:this.props.mod };
  }

  defineAccessor(){
    const { id, title, prefixQueryFields, queryFields, searchOnChange, queryOptions } = this.props
    return new QueryAccessor(id, {
      title, 
      addToFilters: true,
      prefixQueryFields:(searchOnChange ? (prefixQueryFields || queryFields) : false),
      queryFields:queryFields || ["_all"],
      queryOptions:assign({}, queryOptions)
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
  
  onClear(){
    this.accessor.state = this.accessor.state.clear()
    this.searchkit.performSearch()
    this.forceUpdate()
  }

  setFocusState(focused:boolean) {
    this.setState({focused:focused})
  }

  render() {
    const { containerComponent, title, id, collapsable } = this.props
    const block = this.bemBlocks.container
    const value = this.getValue()
    return React.createElement(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: (this.searchkit.getHitsCount() == 0) && (this.getValue() == ""),
      collapsable
    },
      <div className={block().state({focused:this.state.focused})}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className={block("icon")}></div>
          <input type="text"
            data-qa="input-filter"
            className={block("text")}
            placeholder={this.props.placeholder || this.translate("searchbox.placeholder")}
            value={value}
            onFocus={this.setFocusState.bind(this, true)}
            onBlur={this.setFocusState.bind(this, false)}
            ref="queryField"
            autoFocus={false}
            onInput={this.onChange.bind(this)}/>
          <input type="submit" value="search" className={block("action")} data-qa="submit"/>
          <div data-qa="remove" 
               onClick={this.onClear}
               className={block("remove").state({hidden:value == ""})} />
        </form>
      </div>
    );
  }

}
