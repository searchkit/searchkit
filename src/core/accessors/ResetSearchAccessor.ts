import {Accessor, FilterBasedAccessor} from "./";
const each = require("lodash/each")

export interface ResetSearchOptions {
  query?:boolean
  filter?:boolean
}

export class ResetSearchAccessor extends Accessor {

  constructor(public options:ResetSearchOptions={query:true, filter:true}){
    super()
  }

  canReset(){
    let query = this.searchkit.query
    let options = this.options
    return (
      (options.query && query.getQueryString().length > 0) ||
      (options.filter && query.getSelectedFilters().length > 0)
    )
  }

  performReset(){
    if(this.options.query){
      this.searchkit.getQueryAccessor().resetState()
    }
    if(this.options.filter){
      let filters = this.searchkit.getAccessorsByType(FilterBasedAccessor)
      each(filters, (accessor)=> accessor.resetState())
    }
  }
}
