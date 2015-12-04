var ImmutableQuery_1 = require("./ImmutableQuery");
var Searcher_1 = require("./Searcher");
var ESRequest_1 = require("./ESRequest");
var rx = require("rx");
var Promise = require('es6-promise').Promise;
var history_1 = require("../history");
var SearchkitManager = (function () {
    function SearchkitManager(index) {
        var _this = this;
        this.index = index;
        this.searchers = [];
        this.resultsListener = new rx.ReplaySubject(1);
        this.registrationCompleted = new Promise(function (resolve) {
            _this.completeRegistration = resolve;
        });
    }
    SearchkitManager.prototype.addSearcher = function (searcher) {
        this.searchers.push(searcher);
        searcher.setSearchkitManager(this);
    };
    SearchkitManager.prototype.createSearcher = function () {
        var searcher = new Searcher_1.default();
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
    SearchkitManager.prototype.getState = function () {
        var state = {};
        this.iterateAccessors(function (accessor) {
            state[accessor.urlKey] = accessor.state.getValue();
        });
        return state;
    };
    SearchkitManager.prototype.buildSharedQuery = function () {
        var query = new ImmutableQuery_1.ImmutableQuery();
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
            _this.registrationCompleted.then(function () {
                _this.setAccessorStates(location.query);
                _this.search();
            });
        });
    };
    SearchkitManager.prototype.setAccessorStates = function (query) {
        this.iterateAccessors(function (accessor) {
            var value = query[accessor.urlKey];
            accessor.state.setValue(value);
        });
    };
    SearchkitManager.prototype.performSearch = function () {
        var state = this.getState();
        console.log("state", state, this.getAccessors());
        history_1.default.pushState(null, window.location.pathname, state);
    };
    SearchkitManager.prototype.search = function () {
        var _this = this;
        var queryDef = this.makeQueryDef();
        console.log("multiqueries", queryDef.queries);
        if (queryDef.queries.length > 0) {
            var request = new ESRequest_1.default(this.index);
            request.search(queryDef.queries).then(function (response) {
                _.each(response["responses"], function (results, index) {
                    queryDef.searchers[index].setResults(results);
                });
                _this.resultsListener.onNext(response);
            });
        }
    };
    return SearchkitManager;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchkitManager;
//# sourceMappingURL=SearchkitManager.js.map