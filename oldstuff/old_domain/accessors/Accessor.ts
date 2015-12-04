
import RootBuilder from "../builders/RootBuilder";
import ESClient from "../ESClient";
import {BoundStateMap} from "../state/StateMap"
import Newable from "../../common/Newable";

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
