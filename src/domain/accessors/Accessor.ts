
import RootBuilder from "../builders/RootBuilder.ts";
import ESClient from "../ESClient.ts";
import {BoundStateMap} from "../state/StateMap.ts"
import Newable from "../../common/Newable.ts";

abstract class Accessor {
  searcher:ESClient
  state:BoundStateMap


  constructor(public key:string, public options:any = {}){

  }

  searchReset(){
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

  search(){
    this.searcher.stateManager.updateHistory()
  }

  triggerSearchReset(){
    this.searcher.stateManager.searchReset()
  }

  findAccessorsByClass(accessorClass:Newable<Accessor>){
    return this.searcher.stateManager.findAccessorsByClass(accessorClass)
  }
  getResults(){
    return this.searcher.results
  }

}


export default Accessor;
