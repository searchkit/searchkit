import {Accessor} from "./Accessor";

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
