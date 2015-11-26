
import RootBuilder from "../builders/RootBuilder.ts";
import ESClient from "../ESClient.ts";

abstract class Accessor {
  searcher:ESClient

  constructor(public key:string){

  }

  buildQuery(builder:RootBuilder, ...stateValues:Array<any>){

  }

  buildPostQuery(builder:RootBuilder, ...stateValues:Array<any>){

  }

  setSearcher(searcher:ESClient){
    this.searcher = searcher
  }

  getResults(){
    return this.searcher.results
  }

}


export default Accessor;
