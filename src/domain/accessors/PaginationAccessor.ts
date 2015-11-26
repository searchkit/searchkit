import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";

export default class SimpleQueryAccessor extends Accessor{

  buildPostQuery(builder:RootBuilder, page) {
    console.log(page);
    let from = builder.size * (page - 1)
    builder.setFrom(from);
  }

}
