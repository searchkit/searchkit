var ImmutableQuery_1 = require("./query/ImmutableQuery");
var EventEmitter_1 = require("./support/EventEmitter");
var Searcher = (function () {
    function Searcher(searchkitManager) {
        this.searchkitManager = searchkitManager;
        this.accessors = [];
        this.query = new ImmutableQuery_1.ImmutableQuery();
        this.emitter = new EventEmitter_1.EventEmitter();
        this.initialLoading = true;
    }
    Searcher.prototype.translate = function (key) {
        return (this.searchkitManager && this.searchkitManager.translate(key)
            || key);
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
    Searcher.prototype.resetState = function () {
        _.invoke(this.accessors, "resetState");
    };
    Searcher.prototype.buildQuery = function (query) {
        this.query = _.reduce(this.accessors, function (query, accessor) {
            return accessor.buildOwnQuery(query);
        }, query);
        this.beginNewSearch();
        return this.query;
    };
    Searcher.prototype.beginNewSearch = function () {
        this.error = null;
        this.loading = true;
        this.emitter.trigger();
    };
    Searcher.prototype.getResults = function () {
        return this.results;
    };
    Searcher.prototype.setResults = function (results) {
        this.results = results;
        _.invoke(this.accessors, "onNewResults");
        this.onResponseChange();
    };
    Searcher.prototype.setError = function (error) {
        this.clearQuery();
        this.error = error;
        this.onResponseChange();
    };
    Searcher.prototype.onResponseChange = function () {
        this.loading = false;
        this.initialLoading = false;
        this.emitter.trigger();
    };
    return Searcher;
})();
exports.Searcher = Searcher;
//# sourceMappingURL=Searcher.js.map