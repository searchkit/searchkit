import * as React from 'react'
import { Async as SelectAsync, Option } from 'react-select'
import 'react-select/dist/react-select.css'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import { AdapterProps } from '../AdapterProps'

export class ReactSelectAdapter extends React.Component<AdapterProps, any> {
  select: SelectAsync | any
  lastEvent: string
  loadOptions = async (value) => {
    if (this.lastEvent === 'blur') {
      return { options: [] }
    }
    const rawOptions = await this.props.loadOptions(value)

    return {
      options: rawOptions.map((item) => ({
        label: item.key,
        value: item.key
      }))
    }
  }

  onSelect = (selectedItems) => {
    selectedItems = compact(flatten([selectedItems]))
    this.props.onSelect(map(selectedItems, 'value'))
  }

  onFocus = () => {
    this.lastEvent = 'focus'
    this.select.onInputChange('')
  }
  onBlur = () => {
    this.lastEvent = 'blur'
  }
  render() {
    const { selectedValues, multi, itemComponent } = this.props
    let value: Option
    if (multi) {
      value = selectedValues.map((value) => ({ value }))
    } else {
      value = { value: selectedValues[0] }
    }
    return (
      <SelectAsync
        multi={multi}
        value={value}
        cache={false}
        autoload={false}
        openOnFocus={true}
        tabSelectsValue={false}
        valueRenderer={(item) => <span>{item.value}</span>}
        optionRenderer={itemComponent}
        onChange={this.onSelect}
        loadOptions={this.loadOptions}
        ref={(ref) => (this.select = ref)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    )
  }
}
