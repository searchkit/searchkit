
import RootBuilder from "../builders/RootBuilder.ts";
import ESClient from "../ESClient.ts";
import {BoundStateMap} from "../state/StateMap.ts"

abstract class Accessor {
  searcher:ESClient
  state:BoundStateMap

  constructor(public key:string){

  }

  buildQuery(builder:RootBuilder, ...stateValues:Array<any>){

  }

  buildPostQuery(builder:RootBuilder, ...stateValues:Array<any>){

  }

  setSearcher(searcher:ESClient){
    this.searcher = searcher
  }
  
  setState(state:BoundStateMap){
    this.state = state
  }

  getResults(){
    return this.searcher.results
  }

}


export default Accessor;
