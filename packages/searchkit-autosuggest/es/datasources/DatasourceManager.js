var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SearchkitDatasourceManager } from "./SearchkitDatasourceManager";
import each from "lodash/each";
import flatten from "lodash/flatten";
export class DatasourceManager {
    constructor(searchkit, sources = []) {
        this.searchkit = searchkit;
        this.searchkitDatasource = new SearchkitDatasourceManager(searchkit);
        this.sources = [this.searchkitDatasource];
        each(sources, (source) => {
            if (source.isSearchkitSource()) {
                this.searchkitDatasource.addSource(source);
            }
            else {
                this.sources.push(source);
            }
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield Promise.all(this.sources.map((source) => {
                return source.search(query);
            }));
            return flatten(results);
        });
    }
}
//# sourceMappingURL=DatasourceManager.js.map