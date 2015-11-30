import RootBuilder from "./builders/RootBuilder";

class Searcher {
  key:string
  query:Object
  searchkit:SearchkitManager
  constructor(searchkit:SearchkitManager){
    this.searchkit = searchkit
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

  search(){
    const rootBuilder = new RootBuilder()

  }

}
