var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ImmutableQuery } from "searchkit";
import reduce from "lodash/reduce";
import map from "lodash/map";
import filter from "lodash/filter";
export class SearchkitDatasourceManager {
    constructor(searchkit) {
        this.searchkit = searchkit;
        this.transport = searchkit.transport;
        this.sources = [];
    }
    isSearchkitSource() {
        return true;
    }
    addSource(source) {
        source.configure(this.searchkit);
        this.sources.push(source);
    }
    search(query = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let sharedQuery = this.searchkit.accessors.buildSharedQuery(new ImmutableQuery())
                .setSize(0);
            let searchQuery = reduce(this.sources, (searchQuery, source) => {
                return source.search(searchQuery, query);
            }, sharedQuery);
            this.results = yield this.transport.search(searchQuery.getJSON());
            return this.getGroupedResults();
        });
    }
    getGroupedResults() {
        let results = map(this.sources, (source) => {
            return source.getGroupedResult(this.results);
        });
        results = filter(results, (item) => {
            return item.results.length > 0;
        });
        return results;
    }
}
//# sourceMappingURL=SearchkitDatasourceManager.js.map