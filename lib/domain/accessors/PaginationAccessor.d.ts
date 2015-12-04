import Accessor from "./Accessor";
import RootBuilder from "../builders/RootBuilder";
export default class PaginationAccessor extends Accessor {
    setSearcher(searcher: any): void;
    searchReset(): void;
    buildPostQuery(builder: RootBuilder, page: any): void;
}
