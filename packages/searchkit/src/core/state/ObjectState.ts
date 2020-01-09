import { State } from './State'
const isEmpty = require('lodash/isEmpty')

export class ObjectState extends State<Record<string, any>> {
  getValue() {
    return this.value || {}
  }

  hasValue() {
    return !isEmpty(this.value)
  }
}
