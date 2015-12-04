import Accessor from "./Accessor";
import RootBuilder from "../builders/RootBuilder";

export default class PaginationAccessor extends Accessor{
  
  setSearcher(searcher){
    super.setSearcher(searcher)
    this.searcher.stateManager.state.addAutoExpiryKey(this.key)
  }
  
  searchReset(){
    this.state.clear()
  }

  buildPostQuery(builder:RootBuilder, page) {
    let from = builder.size * (page - 1)
    builder.setFrom(from);
  }

}
