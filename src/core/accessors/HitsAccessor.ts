import {Accessor} from "./Accessor";
import * as offset from "document-offset";

export interface HitsOptions{
  scrollTo:string|boolean|Function
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
        if (typeof this.options.scrollTo == "function") {
          this.options.scrollTo();
        }
        else {
          let searchkitOffset = offset(document.querySelector(this.getScrollSelector()))
          document.body.scrollTop = searchkitOffset.top;
        }
      }
    }
  }

  getScrollSelector(){
    return (this.options.scrollTo === true) ?
      "body" :
      this.options.scrollTo.toString();
  }
}
