var ImmutableQuery_1 = require("./query/ImmutableQuery");
(function (SearchType) {
    SearchType[SearchType["count"] = 0] = "count";
    SearchType[SearchType["query_then_fetch"] = 1] = "query_then_fetch";
    SearchType[SearchType["scan"] = 2] = "scan";
})(exports.SearchType || (exports.SearchType = {}));
var SearchType = exports.SearchType;
var Searcher = (function () {
    function Searcher() {
        this.accessors = [];
        this.search_type = SearchType.count;
        this.query = new ImmutableQuery_1.ImmutableQuery();
    }
    Searcher.prototype.setSearchkitManager = function (searchkitManager) {
        this.searchkitManager = searchkitManager;
    };
    Searcher.prototype.hasFilters = function () {
        return this.query && this.query.hasFilters();
    };
    Searcher.prototype.addAccessor = function (accessor) {
        this.accessors.push(accessor);
        accessor.setSearcher(this);
    };
    Searcher.prototype.buildQuery = function (query) {
        _.each(this.accessors, function (accessor) {
            query = accessor.buildOwnQuery(query);
        });
        this.queryHasChanged = ImmutableQuery_1.ImmutableQuery.areQueriesDifferent(this.query, query);
        this.query = query;
    };
    Searcher.prototype.getCommandAndQuery = function () {
        return [
            { index: this.searchkitManager.index, search_type: SearchType[this.search_type] },
            this.query.getJSON()
        ];
    };
    Searcher.prototype.getResults = function () {
        return this.results;
    };
    Searcher.prototype.setResults = function (results) {
        this.results = results;
    };
    return Searcher;
})();
exports.Searcher = Searcher;
//# sourceMappingURL=Searcher.js.map