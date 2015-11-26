import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";
import * as _ from "lodash"
import BoolField from "../builders/BoolField.ts"

export default class FacetAccessor extends Accessor{

  constructor(key, public options:any = {}){
    super(key)
  }

  buildQuery(builder:RootBuilder, ...stateValues:Array<any>){
    const boolField = new BoolField()

    const makeTerm = (value) => {
      return {term:{[this.key]:value}};      
    }

    const terms = _.map(stateValues, makeTerm)
    if(terms.length > 0) {
      if(this.options["operator"] === "OR") {
        boolField.should(terms)
      } else {
        boolField.must(terms)
      }
  
      builder.addFilter(this.key, boolField)  
    }
    
  }

  buildPostQuery(builder:RootBuilder, ...stateValues:Array<any>){

  }

}
