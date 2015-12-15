var ImmutableQuery_1 = require("./query/ImmutableQuery");
var Searcher = (function () {
    function Searcher() {
        this.listeners = [];
        this.accessors = [];
        this.query = new ImmutableQuery_1.ImmutableQuery();
    }
    Searcher.prototype.setSearchkitManager = function (searchkitManager) {
        this.searchkitManager = searchkitManager;
    };
    Searcher.prototype.translate = function (key) {
        return this.searchkitManager.translate(key);
    };
    Searcher.prototype.addListener = function (fn) {
        var _this = this;
        this.listeners.push(fn);
        return function () {
            _this.listeners = _.without(_this.listeners, fn);
        };
    };
    Searcher.prototype.triggerListeners = function () {
        _.each(this.listeners, function (fn) { return fn(); });
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
    Searcher.prototype.hasFiltersOrQuery = function () {
        return this.query && this.query.hasFiltersOrQuery();
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
            this.triggerListeners();
        }
    };
    Searcher.prototype.getCommandAndQuery = function () {
        return [
            { index: this.getIndex() },
            this.query.getJSON()
        ];
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
        this.triggerListeners();
    };
    return Searcher;
})();
exports.Searcher = Searcher;
//# sourceMappingURL=Searcher.js.map