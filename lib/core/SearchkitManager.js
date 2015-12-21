var ImmutableQuery_1 = require("./query/ImmutableQuery");
var Searcher_1 = require("./Searcher");
var history_1 = require("./history");
var ESTransport_1 = require("./ESTransport");
var _ = require("lodash");
require('es6-promise').polyfill();
var SearchkitManager = (function () {
    function SearchkitManager(host, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.host = host;
        this.searchers = [];
        this.registrationCompleted = new Promise(function (resolve) {
            _this.completeRegistration = resolve;
        });
        this.listenToHistory(history_1.history);
        this.defaultQueries = [];
        this.translateFunction = _.identity;
        this.transport = new ESTransport_1.ESTransport(this.host);
        this.performSearch = _.throttle(this._performSearch.bind(this), 100, { trailing: true });
        this.searchMode = options.searchMode || "single";
        if (this.searchMode == "single") {
            this.primarySearcher = this.createSearcher();
        }
    }
    SearchkitManager.prototype.addSearcher = function (searcher) {
        this.searchers.push(searcher);
        searcher.setSearchkitManager(this);
    };
    SearchkitManager.prototype.addDefaultQuery = function (fn) {
        this.defaultQueries.push(fn);
    };
    SearchkitManager.prototype.translate = function (key) {
        return this.translateFunction(key);
    };
    SearchkitManager.prototype.createSearcher = function () {
        var searcher = new Searcher_1.Searcher();
        this.addSearcher(searcher);
        return searcher;
    };
    SearchkitManager.prototype.getAccessors = function () {
        return _.chain(this.searchers)
            .pluck("accessors")
            .flatten()
            .value();
    };
    SearchkitManager.prototype.iterateAccessors = function (fn) {
        var accessors = this.getAccessors();
        _.each(accessors, fn);
    };
    SearchkitManager.prototype.resetState = function () {
        this.iterateAccessors(function (accessor) {
            accessor.resetState();
        });
    };
    SearchkitManager.prototype.getState = function () {
        var state = {};
        this.iterateAccessors(function (accessor) {
            var val = accessor.state.getValue();
            if (val) {
                state[accessor.urlKey] = val;
            }
        });
        return state;
    };
    SearchkitManager.prototype.hasState = function () {
        return !_.isEmpty(this.getState());
    };
    SearchkitManager.prototype.buildSharedQuery = function () {
        var query = new ImmutableQuery_1.ImmutableQuery();
        query = _.reduce(this.defaultQueries, function (currentQuery, fn) {
            return fn(currentQuery);
        }, query);
        this.iterateAccessors(function (accessor) {
            query = accessor.buildSharedQuery(query);
        });
        return query;
    };
    SearchkitManager.prototype.clearSearcherQueries = function () {
        _.each(this.searchers, function (searcher) {
            searcher.clearQuery();
        });
    };
    SearchkitManager.prototype.makeQueryDef = function () {
        var queryDef = {
            queries: [],
            searchers: []
        };
        var query = this.buildSharedQuery();
        _.each(this.searchers, function (searcher) {
            searcher.buildQuery(query);
            if (searcher.queryHasChanged) {
                queryDef.queries = queryDef.queries.concat(searcher.getCommandAndQuery());
                queryDef.searchers.push(searcher);
            }
        });
        return queryDef;
    };
    SearchkitManager.prototype.listenToHistory = function (history) {
        var _this = this;
        history.listen(function (location) {
            //action is POP when the browser modified
            if (location.action === "POP") {
                _this.registrationCompleted.then(function () {
                    _this.setAccessorStates(location.query);
                    _this._search();
                });
            }
        });
    };
    SearchkitManager.prototype.setAccessorStates = function (query) {
        this.iterateAccessors(function (accessor) {
            var value = query[accessor.urlKey];
            accessor.state = accessor.state.setValue(value);
        });
    };
    SearchkitManager.prototype.notifyStateChange = function (oldState) {
        this.iterateAccessors(function (accessor) {
            accessor.onStateChange(oldState);
        });
    };
    SearchkitManager.prototype._performSearch = function () {
        this.notifyStateChange(this.state);
        this._search();
        history_1.history.pushState(null, window.location.pathname, this.state);
    };
    SearchkitManager.prototype.search = function () {
        this.performSearch();
    };
    //TODO: refactor single, multiple 
    SearchkitManager.prototype._search = function () {
        var _this = this;
        this.state = this.getState();
        var queryDef = this.makeQueryDef();
        console.log("multiqueries", queryDef.queries);
        if (queryDef.queries.length > 0) {
            if (this.searchMode === "single") {
                this.transport.search(queryDef.queries[0]).then(function (response) {
                    queryDef.searchers[0].setResults(response);
                }).catch(function (error) {
                    _this.clearSearcherQueries();
                    _.each(queryDef.searchers, function (searcher) {
                        searcher.setError(error);
                    });
                });
            }
            else if (this.searchMode === "multiple") {
                this.transport.msearch(queryDef.queries).then(function (response) {
                    _.each(response["responses"], function (results, index) {
                        queryDef.searchers[index].setResults(results);
                    });
                }).catch(function (error) {
                    _this.clearSearcherQueries();
                    _.each(queryDef.searchers, function (searcher) {
                        searcher.setError(error);
                    });
                });
            }
        }
    };
    return SearchkitManager;
})();
exports.SearchkitManager = SearchkitManager;
//# sourceMappingURL=SearchkitManager.js.map