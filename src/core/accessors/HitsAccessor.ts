import {Accessor} from "./Accessor";
import * as offset from "document-offset";

export interface HitsOptions{
  scrollTo:string|boolean
}

export class HitsAccessor extends Accessor {

  constructor(public options:HitsOptions){
    super()
  }

  setResults(results){
    super.setResults(results)
    this.scrollIfNeeded()
  }

  scrollIfNeeded(){
    if (!this.searchkit.initialLoading && this.searchkit.hasHitsChanged()) {
      if (this.options.scrollTo) {
        let searchkitOffset = offset(document.querySelector(this.getScrollSelector()))
        document.body.scrollTop = searchkitOffset.top;
      }
    }
  }

  getScrollSelector(){
    return (this.options.scrollTo === true) ?
      "body" :
      this.options.scrollTo.toString();
  }
}
