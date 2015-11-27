import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";

export default class PageSizeAccessor extends Accessor{

  buildPostQuery(builder:RootBuilder, pageSize) {
    builder.setSize(pageSize);
  }

}
