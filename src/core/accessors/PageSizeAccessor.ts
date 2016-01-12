import {Accessor} from "./Accessor";

export class PageSizeAccessor extends Accessor {

  constructor(public size:number){
    super()
  }

  buildOwnQuery(query){
    return query.setSize(this.size)
  }
}
