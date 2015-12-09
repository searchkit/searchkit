var ImmutableQuery_1 = require("./query/ImmutableQuery");
var rx = require("rx");
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
        this.stateListener = new rx.Subject();
        this.query = new ImmutableQuery_1.ImmutableQuery();
    }
    Searcher.prototype.setSearchkitManager = function (searchkitManager) {
        this.searchkitManager = searchkitManager;
    };
    Searcher.prototype.setIndex = function (index) {
        this.index = index;
    };
    Searcher.prototype.getIndex = function () {
        return this.index || this.searchkitManager.index;
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
        if (this.queryHasChanged) {
            this.loading = true;
            this.stateListener.onNext(true);
        }
    };
    Searcher.prototype.getCommandAndQuery = function () {
        return [
            { index: this.getIndex(), search_type: SearchType[this.search_type] },
            this.query.getJSON()
        ];
    };
    Searcher.prototype.getResults = function () {
        return this.results;
    };
    Searcher.prototype.setResults = function (results) {
        this.results = results;
        this.loading = false;
        this.stateListener.onNext(true);
    };
    return Searcher;
})();
exports.Searcher = Searcher;
//# sourceMappingURL=Searcher.js.map