import {Accessor} from "./Accessor";

export class HighlightAccessor extends Accessor {

  highlightFields:any
  constructor(public fields:Array<string>){
    super()
    this.highlightFields = this.computeHighlightedFields(fields)
  }

  computeHighlightedFields(fields) {
    return {
      fields:_.mapValues(
        _.object(fields),
        _.constant({})
      )
    }
  }
  buildOwnQuery(query){
    return query.setHighlight(this.highlightFields)
  }
}
