var ImmutableQuery_1 = require("./query/ImmutableQuery");
var Searcher_1 = require("./Searcher");
var ESMultiRequest_1 = require("./ESMultiRequest");
var history_1 = require("./history");
require('es6-promise').polyfill();
var SearchkitManager = (function () {
    function SearchkitManager(index) {
        var _this = this;
        this.index = index;
        this.searchers = [];
        this.registrationCompleted = new Promise(function (resolve) {
            _this.completeRegistration = resolve;
        });
        this.listenToHistory(history_1.history);
        this.defaultQueries = [];
        this.translateFunction = _.identity;
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
    SearchkitManager.prototype.performSearch = function () {
        this.notifyStateChange(this.state);
        this._search();
        console.log(this.state);
        history_1.history.pushState(null, window.location.pathname, this.state);
    };
    SearchkitManager.prototype.search = function () {
        this.performSearch();
    };
    SearchkitManager.prototype._search = function () {
        this.state = this.getState();
        var queryDef = this.makeQueryDef();
        console.log("multiqueries", queryDef.queries);
        if (queryDef.queries.length > 0) {
            var request = new ESMultiRequest_1.ESMultiRequest();
            request.search(queryDef.queries).then(function (response) {
                _.each(response["responses"], function (results, index) {
                    queryDef.searchers[index].setResults(results);
                });
            });
        }
    };
    return SearchkitManager;
})();
exports.SearchkitManager = SearchkitManager;
//# sourceMappingURL=SearchkitManager.js.map