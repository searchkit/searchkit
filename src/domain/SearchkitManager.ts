import RootBuilder from "./builders/RootBuilder";

class Searcher {
  key:string
  query:Object
  searchkit:SearchkitManager
  accessors:Array<Accessor>
  results:Object
  
  constructor(searchkit:SearchkitManager){
    this.searchkit = searchkit
  }

  invokeAccessor(builder, method){

  }

  buildQuery(builder, ...stateValues){
    this.invokeAccessor(builder, "buildQuery")
    this.invokeAccessor(builder, "buildPostQuery")
  }
}

class Accessor {
  searcherKey:string
  buildCommonQuery(){

  }
  buildQuery(){

  }
  buildPostQuery(){

  }

}

export default class SearchkitManager {

  searchers:Array<Searcher>
  accessors:Array<Accessor>
  state:any
  host:string

  constructor(host){
    this.host = host
    this.searchers = []
  }
  invokeAccessor(builder){

  }
  search(){
    const builder = new RootBuilder()
    this.invokeAccessor(builder)
  }

}
