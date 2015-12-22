var ImmutableQuery_1 = require("./query/ImmutableQuery");
var EventEmitter_1 = require("./support/EventEmitter");
var Searcher = (function () {
    function Searcher() {
        this.accessors = [];
        this.query = new ImmutableQuery_1.ImmutableQuery();
        this.emitter = new EventEmitter_1.EventEmitter();
    }
    Searcher.prototype.setSearchkitManager = function (searchkitManager) {
        this.searchkitManager = searchkitManager;
    };
    Searcher.prototype.translate = function (key) {
        if (this.searchkitManager) {
            return this.searchkitManager.translate(key);
        }
        else {
            return key;
        }
    };
    Searcher.prototype.hasFiltersOrQuery = function () {
        return this.query && this.query.hasFiltersOrQuery();
    };
    Searcher.prototype.addAccessor = function (accessor) {
        this.accessors.push(accessor);
        accessor.setSearcher(this);
    };
    Searcher.prototype.clearQuery = function () {
        delete this.query;
    };
    Searcher.prototype.buildQuery = function (query) {
        _.each(this.accessors, function (accessor) {
            query = accessor.buildOwnQuery(query);
        });
        this.queryHasChanged = ImmutableQuery_1.ImmutableQuery.areQueriesDifferent(this.query, query);
        this.query = query;
        if (this.queryHasChanged) {
            this.error = null;
            this.loading = true;
            this.emitter.trigger();
        }
    };
    Searcher.prototype.getResults = function () {
        return this.results;
    };
    Searcher.prototype.setResults = function (results) {
        this.results = results;
        this.loading = false;
        _.each(this.accessors, function (accessor) {
            accessor.setResultsState();
        });
        this.emitter.trigger();
    };
    Searcher.prototype.setError = function (error) {
        this.clearQuery();
        this.error = error;
        this.loading = false;
        this.emitter.trigger();
    };
    return Searcher;
})();
exports.Searcher = Searcher;
//# sourceMappingURL=Searcher.js.map