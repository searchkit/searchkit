import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";

export default class PaginationAccessor extends Accessor{
  
  constructor(){
    super("p")
  }
  
  searchReset(){
    this.state.clear()
  }

  buildPostQuery(builder:RootBuilder, page) {
    let from = builder.size * (page - 1)
    builder.setFrom(from);
  }

}
