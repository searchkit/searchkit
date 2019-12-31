import { ValueState } from '../../core'
import { StatefulAccessor } from './StatefulAccessor'
const head = require('lodash/head')
const find = require('lodash/find')

export class ViewOptionsAccessor extends StatefulAccessor<ValueState> {
  state = new ValueState()
  options: Array<any>
  constructor(key, options: Array<any>) {
    super(key)
    this.options = options
  }

  getSelectedOption() {
    return (
      find(this.options, { key: this.state.getValue() }) ||
      find(this.options, { defaultOption: true }) ||
      head(this.options)
    )
  }

  setView(key) {
    const view = find(this.options, { key })
    if (view) {
      if (view.defaultOption) {
        this.state = this.state.clear()
      } else {
        this.state = this.state.setValue(view.key)
      }
      this.search()
    }
  }

  search() {
    //this won't fire search as query didn't change, but it will serialize url
    //might need better way
    this.searchkit.performSearch(false, false)
    this.searchkit.emitter.trigger()
  }
}
