import Accessor from "./Accessor";
import RootBuilder from "../builders/RootBuilder";
import SimpleQueryField from "../builders/SimpleQueryField"

export default class SimpleQueryAccessor extends Accessor {

  buildQuery(builder:RootBuilder, query){
    if(query){
      let simpleQueryField = new SimpleQueryField()
      simpleQueryField.set(query);
      builder.setQuery(simpleQueryField);
    }    
  }

}
