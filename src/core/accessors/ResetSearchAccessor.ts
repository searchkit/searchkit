import {Accessor, FilterBasedAccessor, PaginationAccessor} from "./";
import {each} from "lodash"

export interface ResetSearchOptions {
  query?:boolean
  filter?:boolean
  pagination?:boolean
}

export class ResetSearchAccessor extends Accessor {

  constructor(public options:ResetSearchOptions={query:true, filter:true, pagination:true}){
    super()
  }

  canReset(){
    let query = this.searchkit.query
    let options = this.options
    return (
      (options.pagination && query.getFrom() > 0) ||
      (options.query && query.getQueryString().length > 0) ||
      (options.filter && query.getSelectedFilters().length > 0)
    )
  }

  performReset(){
    let query = this.searchkit.query
    if(this.options.query){
      this.searchkit.getQueryAccessor().resetState()
    }
    if(this.options.filter){
      let filters = this.searchkit.getAccessorsByType(FilterBasedAccessor)
      each(filters, (accessor)=> accessor.resetState())
      each(query.getSelectedFilters() || [], f => f.remove())
    }
    let paginationAccessor = this.searchkit.getAccessorByType(PaginationAccessor)
    if(this.options.pagination && paginationAccessor){
      paginationAccessor.resetState()
    }

  }
}
