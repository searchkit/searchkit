import * as React from "react"
import { Async as SelectAsync, OptionValues, Option, Options } from 'react-select'
import 'react-select/dist/react-select.css';
import compact from "lodash/compact"
import flatten from "lodash/flatten"
import property from "lodash/property"
import map from "lodash/map"
import {AdapterProps} from "../AdapterProps"

export class ReactSelectAdapter extends React.Component<AdapterProps, any> {
    select:SelectAsync
    lastEvent:String
    loadOptions = async (value) => {
        if(this.lastEvent === 'blur'){
            return {options:[]}
        }
        let options = await this.props.loadOptions(value)
        
        options = options.map((item)=> {
            item.label = item.key
            item.value = item.key
            return item
        })
        return {options}
    }

    onSelect = (selectedItems) => {
        selectedItems = compact(flatten([selectedItems]))
        this.props.onSelect(map(selectedItems, 'value'))
    }

    onFocus = (_e)=> {
        this.lastEvent = "focus"
        this.select['onInputChange']('')
    }
    onBlur = (_e)=> {
        this.lastEvent = "blur"
    }
    render() {
        let { selectedValues, multi, itemComponent } = this.props
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
                value={value} 
                cache={false} 
                autoload={false}              
                openOnFocus={true}
                tabSelectsValue={false}
                valueRenderer={(item) => <span>{item.value}</span>}
                optionRenderer={itemComponent}
                onChange = { this.onSelect }
                loadOptions={this.loadOptions}
                ref={(ref)=> this.select = ref}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
            />
        )
    }
}
