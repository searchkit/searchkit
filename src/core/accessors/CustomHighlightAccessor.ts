import {Accessor} from "./Accessor";
const mapValues = require("lodash/mapValues")
const zipObject = require("lodash/zipObject")
const constant = require("lodash/constant")


export class CustomHighlightAccessor extends Accessor {

  highlightRequest: any
  constructor(public request: any) {
    super()
    this.highlightRequest = request
  }

  buildOwnQuery(query) {
    return query.setHighlight(this.highlightRequest)
  }
}
