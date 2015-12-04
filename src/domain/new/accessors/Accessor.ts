import {State} from "../State"
import {ImmutableQuery} from "../ImmutableQuery";
import Searcher from "../Searcher"

export default class Accessor<T extends State<any>> {
  key:string
  urlKey:string
  state:T
  searcher:Searcher
  constructor(key, urlString?){
    this.key = key
    this.urlKey = urlString || key && key.replace(/\./g, "_")
  }

  setSearcher(searcher){
    this.searcher = searcher
  }

  getResults(){
    return this.searcher.results
  }

  buildSharedQuery(query:ImmutableQuery){
    return query
  }
  buildOwnQuery(query:ImmutableQuery){
    return query
  }
}
