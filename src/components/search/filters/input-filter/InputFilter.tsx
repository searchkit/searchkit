import * as React from "react";

import {
  SearchkitComponent,
  SearchkitComponentProps,
  ReactComponentType
} from "../../../../core";

import { SearchBox } from "../../search-box/src/SearchBox"

import {
  Panel
} from "../../../ui"

const defaults = require('lodash/defaults')

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

  static propTypes = defaults({
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    searchOnChange: React.PropTypes.bool,
    searchThrottleTime: React.PropTypes.number,
    queryFields:React.PropTypes.arrayOf(React.PropTypes.string),
    prefixQueryFields:React.PropTypes.arrayOf(React.PropTypes.string),
    queryOptions:React.PropTypes.object,
    collapsable: React.PropTypes.bool,
    mod: React.PropTypes.string,
    placeholder: React.PropTypes.string
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    containerComponent: Panel,
    collapsable: false,
    mod: "sk-input-filter"
  }

  render() {
    const { containerComponent, title, id, collapsable } = this.props


    return React.createElement(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: false,
      collapsable
    },
      <SearchBox id={id} 
        mod={this.props.mod}
        queryFields={this.props.queryFields}
        prefixQueryFields={this.props.prefixQueryFields}
        queryOptions={this.props.queryOptions}
        searchOnChange={this.props.searchOnChange}
        searchThrottleTime={this.props.searchThrottleTime}
        placeholder={this.props.placeholder}
        autofocus={false} />
    );
  }

}
