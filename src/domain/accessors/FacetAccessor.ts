import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";
import * as _ from "lodash"
import BoolField from "../builders/BoolField.ts"

export default class FacetAccessor extends Accessor{
  
  getBuckets(){
    const results = this.getResults()
    const path = ['aggregations',this.key, this.key,'buckets']
    return _.get(results, path, [])
  }

  buildQuery(builder:RootBuilder, ...stateValues:Array<any>){
    const boolField = new BoolField()

    const makeTerm = (value) => {
      return {term:{[this.key]:value}};
    }

    const terms = _.map(stateValues, makeTerm)
    if(terms.length > 0) {
      if(this.isOrOperator()) {
        boolField.should(terms)
      } else {
        boolField.must(terms)
      }

      builder.addFilter(this.key, boolField)
    }
  }

  isOrOperator(){
    return this.options["operator"] === "OR"
  }

  buildPostQuery(builder:RootBuilder, ...stateValues:Array<any>){
    let excludedKey = undefined
    if(this.isOrOperator()){
      excludedKey = this.key
    }
    builder.setAggs(this.key, {
      filter:builder.getFilters(excludedKey),      
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
