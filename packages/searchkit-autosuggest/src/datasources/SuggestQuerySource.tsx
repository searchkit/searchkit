import * as React from "react"
import { RenderComponentType, renderComponent } from "searchkit"
import { DataSource } from "./Types"

export type SuggestQuerySourceOptions = {
    component?: RenderComponentType<{query:String}>
}

const defaultComponent = ({query})=> {
    return <span>Search for "{query}"</span>
}

export class SuggestQuerySource implements DataSource {
    options:SuggestQuerySourceOptions
    constructor(options={}){
        this.options = options
    }
    isSearchkitSource(){
        return false        
    }

    async search(query){
        let {component=defaultComponent} = this.options
        return [{
            results:[{
                key:query,
                render(){
                    return renderComponent(component, {query})                    
                },
                select(){
                    return query
                }
            }]
        }]
    }
}