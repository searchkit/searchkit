import * as React from "react"
import { Async as SelectAsync, OptionValues, Option, Options } from 'react-select'
import 'react-select/dist/react-select.css';
import compact from "lodash/compact"
import flatten from "lodash/flatten"
import property from "lodash/property"
import map from "lodash/map"
import {AdapterProps} from "../AdapterProps"



export class ReactSelectAdapter extends React.Component<AdapterProps, any> {

    loadOptions = async (value) => {
        let options = await this.props.loadOptions(value)
        return { options }
    }

    onSelect = (selectedItems) => {
        selectedItems = compact(flatten([selectedItems]))
        this.props.onSelect(map(selectedItems, 'value'))
    }

    render() {
        let { selectedValues, multi } = this.props
        let value: Options | Option
        if(multi){
            value = selectedValues.map((value) => {
                return { value }
            })
        } else {
            value = {value:selectedValues[0]}
        }        
        return (  
            <SelectAsync
                multi={multi}
                autoload={true}
                value={value}
                valueRenderer={(item) => <span>{item.value}</span>}
                onChange = { this.onSelect }
                loadOptions={this.loadOptions}
                />
        )
    }
}
