import * as React from "react";

import { RangeProps } from './RangeProps'

let block = require("bem-cn")

import {defaults} from "lodash"
import {get} from "lodash"
import {clamp} from "lodash"
import {omit} from 'lodash'

/*
 * Input validates input and only calls onChange for valid values
 */
export class NumberInput extends React.Component<any, any> {

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
      value: props.value
    }
  }

  static defaultProps = {
    value: ''
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value })
    }
  }

  isValid(value) {
    value = '' + value // ensure string
    // Weird number check, please do something else
    return ('' + parseInt(value, 10) == value)
  }

  onChange(e) {
    const { field, onChange } = this.props

    const value = e.target.value
    this.setState({ value })
    if (this.isValid(value) && onChange) {
      onChange(value, field)
    }
  }

  render() {
    const rest = omit(this.props, ['field', 'onChange'])
    return <input type="number" {...rest} value={this.state.value} onChange={this.onChange} />
  }
}

export interface RangeInputProps extends RangeProps {
  minPlaceholder?: string
  maxPlaceholder?: string
}


export class RangeInput extends React.Component<RangeInputProps, {}> {
  refs: {
    [key: string]: any;
    min: (NumberInput);
    max: (NumberInput);
  }

  static defaultProps = {
    mod: "sk-range-input",
    translate: (str) => undefined,
    minPlaceholder: 'min',
    maxPlaceholder: 'max'
  }

  constructor(props) {
    super(props)
    // this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(value, key) {
    // const { min, max, minValue, maxValue, onFinished } = this.props
    // const values = defaults({
    //   [key]: clamp(value, min, max)
    // }, {
    //   min: minValue, max: maxValue
    // })
    // onFinished(values)
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.onFinished({ min: this.refs.min.state.value, max: this.refs.max.state.value })
  }

  render() {
    const { mod, className, minValue, maxValue, translate, minPlaceholder, maxPlaceholder } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    return (
      <form className={bemBlocks.container().mix(className) } onSubmit={this.handleSubmit}>
        <NumberInput ref="min" className={bemBlocks.container("input") }
               value={minValue}
               field="min"
               onChange={this.handleInputChange}
               placeholder={translate('range.min') || minPlaceholder} />
        <div className={bemBlocks.container("to-label")}>{translate('range.to') || '-'}</div>
        <NumberInput ref="max" className={bemBlocks.container("input")}
               value={maxValue}
               field="max"
               onChange={this.handleInputChange}
               placeholder={translate('range.max') || maxPlaceholder } />
        <button type="submit" className={bemBlocks.container("submit")}>{ translate('range.submit') || 'Go'}</button>
      </form>
    )
  }

}
