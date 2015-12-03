var ImmutableQuery_ts_1 = require("./ImmutableQuery.ts");
var Accessor = (function () {
    function Accessor() {
    }
    Accessor.prototype.buildSharedQuery = function (query) {
        return null;
    };
    Accessor.prototype.buildOwnQuery = function (query) {
        return null;
    };
    return Accessor;
})();
var Searcher = (function () {
    function Searcher() {
        this.accessors = [];
    }
    Searcher.prototype.addAccessor = function (accessor) {
        this.accessors.push(accessor);
    };
    Searcher.prototype.buildQuery = function (query) {
        _.each(this.accessors, function (accessor) {
            query = accessor.buildOwnQuery(query);
        });
        this.queryHasChanged = ImmutableQuery_ts_1.ImmutableQuery.areQueriesDifferent(this.query, query);
        this.query = query;
    };
    return Searcher;
})();
var SearchkitManager = (function () {
    function SearchkitManager() {
        this.searchers = [];
    }
    SearchkitManager.prototype.getAccessors = function () {
        return _.chain(this.searchers)
            .pluck("accessors")
            .flatten()
            .value();
    };
    SearchkitManager.prototype.buildSharedQuery = function () {
        var query = new ImmutableQuery_ts_1.ImmutableQuery();
        var accessors = this.getAccessors();
        _.each(accessors, function (accessor) {
            query = accessor.buildSharedQuery(query);
        });
        return query;
    };
    SearchkitManager.prototype.search = function () {
        var query = this.buildSharedQuery();
        var queries = [];
        _.each(this.searchers, function (searcher) {
            searcher.buildQuery(query);
            if (searcher.queryHasChanged) {
                queries.push(searcher.query);
            }
        });
    };
    return SearchkitManager;
})();
//# sourceMappingURL=Searcher.js.map