import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";
export default class PaginationAccessor extends Accessor {
    setSearcher(searcher: any): void;
    searchReset(): void;
    buildPostQuery(builder: RootBuilder, page: any): void;
}
