import {Searcher} from "./Searcher"
import {SearchkitManager} from "./SearchkitManager";

export class SearcherManager {
  searchers:Array<Searcher>

  constructor(){
    this.searchers = []
  }

  addSearcher(searcher){
    this.searchers.push(searcher)
  }


}
