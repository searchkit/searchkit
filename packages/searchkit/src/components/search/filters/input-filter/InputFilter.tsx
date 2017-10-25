import * as React from "react";
import * as PropTypes from "prop-types";

import {
  QueryAccessor,
  SearchkitComponent,
  SearchkitComponentProps,
  RenderComponentType,
  renderComponent
} from "../../../../core";

import { SearchBox } from "../../search-box/SearchBox"

import {
  Panel
} from "../../../ui"

const defaults = require("lodash/defaults")
const throttle = require("lodash/throttle")
const assign = require("lodash/assign")
const isUndefined = require("lodash/isUndefined")

export interface InputFilterProps extends SearchkitComponentProps {
  id: string
  title: string
  mod?: string
  searchOnChange?:boolean
  searchThrottleTime?:number
  queryBuilder?:Function
  queryFields?:Array<string>
  queryOptions?:any
  prefixQueryFields?:Array<string>
  prefixQueryOptions?:any
  placeholder?: string
  blurAction?:"search"|"restore"
  containerComponent?: RenderComponentType<any>
}

export class InputFilter extends SearchkitComponent<InputFilterProps, any> {
  accessor:QueryAccessor
  lastSearchMs:number
  throttledSearch: () => void

  static translations:any = {
    "searchbox.placeholder":"Search",
    "searchbox.button":"search"
  }
  translations = SearchBox.translations

  static defaultProps = {
    containerComponent: Panel,
    collapsable: false,
    mod: "sk-input-filter",
    searchThrottleTime:200,
    blurAction: "search"
  }

  static propTypes = defaults({
    id:PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    searchOnChange:PropTypes.bool,
    searchThrottleTime:PropTypes.number,
    queryBuilder:PropTypes.func,
    queryFields:PropTypes.arrayOf(PropTypes.string),
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

  constructor (props:InputFilterProps) {
    super(props);
    this.state = {
      focused:false,
      input: undefined
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
    const {
      id, title, prefixQueryFields, queryFields, queryBuilder,
      queryOptions, prefixQueryOptions } = this.props
    return new QueryAccessor(id, {
      title,
      addToFilters: true,
      queryFields:queryFields || ["_all"],
      prefixQueryFields,
      queryOptions:assign({}, queryOptions),
      prefixQueryOptions:assign({}, prefixQueryOptions),
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

  onClear(){
    this.accessor.state = this.accessor.state.clear()
    this.searchkit.performSearch()
    this.setState({ input: undefined })
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
    const { containerComponent, title, id } = this.props
    const block = this.bemBlocks.container
    const value = this.getValue()
    return renderComponent(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: (this.searchkit.getHitsCount() == 0) && (this.getAccessorValue() == "")
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
          <input type="submit" value={this.translate("searchbox.button")} className={block("action")} data-qa="submit"/>
          <div data-qa="remove"
               onClick={this.onClear}
               className={block("remove").state({hidden:value == ""})} />
        </form>
      </div>
    );
  }

}
