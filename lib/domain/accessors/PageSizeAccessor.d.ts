import Accessor from "./Accessor";
import RootBuilder from "../builders/RootBuilder";
export default class PageSizeAccessor extends Accessor {
    buildPostQuery(builder: RootBuilder, pageSize: any): void;
}
