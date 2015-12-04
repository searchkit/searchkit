import Accessor from "./Accessor";
import RootBuilder from "../builders/RootBuilder";
import * as _ from "lodash"
import BoolField from "../builders/BoolField"

export default class HierarchicalFacetAccessor extends Accessor{

  getBuckets(){
    const results = this.getResults()
    const path = ['aggregations',this.key, this.key,'buckets']
    return _.get(results, path, [])
  }

  searchReset(){
    this.state.clear()
  }

  buildQuery(builder:RootBuilder, ...stateValues:Array<any>){

    const boolField = new BoolField()

    const makeTerm = (value) => {
      return {term:{[this.key]:value}};
    }

    const terms = _.map(stateValues, makeTerm)
    if(terms.length > 0) {
      boolField.must(terms)
      builder.addFilter(this.key, boolField)
    }
  }

  buildPostQuery(builder:RootBuilder, ...stateValues:Array<any>){
    let excludedKey = undefined

    builder.setAggs(this.key, {
      filter:builder.getFilters(this.options.fields),
      aggs:{
        [this.key]:{
          terms:{
            field:this.key,
            size:50
          }
        }
      }
    })

  }

}
