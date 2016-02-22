import {Accessor} from "./Accessor";


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
    if(this.searchkit.hasHitsChanged()){
      if(this.options.scrollTo){
        const scrollSelector:string = (this.options.scrollTo == true) ? "body" : this.options.scrollTo.toString()
  			document.querySelector(scrollSelector).scrollTop = 0;
      }
    }
  }
}
