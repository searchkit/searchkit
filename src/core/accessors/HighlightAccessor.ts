import {Accessor} from "./Accessor";
import {mapValues} from "lodash"
import {zipObject} from "lodash"
import {constant} from "lodash"


export class HighlightAccessor extends Accessor {

  highlightFields:any
  constructor(public fields:Array<string>){
    super()
    this.highlightFields = this.computeHighlightedFields(fields)
  }

  computeHighlightedFields(fields) {
    return {
      fields:mapValues(
        zipObject(fields),
        constant({})
      )
    }
  }
  buildOwnQuery(query){
    return query.setHighlight(this.highlightFields)
  }
}
