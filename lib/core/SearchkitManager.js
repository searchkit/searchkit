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
        this.multipleSearchers = options.multipleSearchers || false;
        this.primarySearcher = this.createSearcher();
    }
    SearchkitManager.prototype.addSearcher = function (searcher) {
        this.searchers.push(searcher);
        return searcher;
    };
    SearchkitManager.prototype.addDefaultQuery = function (fn) {
        this.defaultQueries.push(fn);
    };
    SearchkitManager.prototype.translate = function (key) {
        return this.translateFunction(key);
    };
    SearchkitManager.prototype.createSearcher = function () {
        return this.addSearcher(new Searcher_1.Searcher(this));
    };
    SearchkitManager.prototype.getAccessors = function () {
        return _.chain(this.searchers)
            .pluck("accessors")
            .flatten()
            .value();
    };
    SearchkitManager.prototype.resetState = function () {
        _.invoke(this.searchers, "resetState");
    };
    SearchkitManager.prototype.getState = function () {
        return _.reduce(this.getAccessors(), function (state, accessor) {
            return _.extend(state, accessor.getQueryObject());
        }, {});
    };
    SearchkitManager.prototype.buildSharedQuery = function () {
        var query = new ImmutableQuery_1.ImmutableQuery();
        query = _.reduce(this.defaultQueries, function (currentQuery, fn) {
            return fn(currentQuery);
        }, query);
        return _.reduce(this.getAccessors(), function (query, accessor) {
            return accessor.buildSharedQuery(query);
        }, query);
    };
    SearchkitManager.prototype.clearSearcherQueries = function () {
        _.invoke(this.searchers, "clearQuery");
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
        _.invoke(this.getAccessors(), "fromQueryObject", query);
    };
    SearchkitManager.prototype.notifyStateChange = function (oldState) {
        _.invoke(this.getAccessors(), "onStateChange", oldState);
    };
    SearchkitManager.prototype.performSearch = function () {
        this.notifyStateChange(this.state);
        this._search();
        history_1.history.pushState(null, window.location.pathname, this.state);
    };
    SearchkitManager.prototype.search = function () {
        this.performSearch();
    };
    //TODO: refactor single, multiple
    SearchkitManager.prototype._search = function () {
        this.state = this.getState();
        var query = this.buildSharedQuery();
        _.invoke(this.searchers, "buildQuery", query);
        var changedSearchers = _.filter(this.searchers, { queryHasChanged: true });
        var queries = _.map(changedSearchers, function (searcher) {
            return searcher.query.getJSON();
        });
        console.log("multiqueries", queries);
        if (queries.length > 0) {
            this.transport.search(queries).then(function (responses) {
                _.each(responses, function (results, index) {
                    changedSearchers[index].setResults(results);
                });
            }).catch(function (error) {
                _.invoke(changedSearchers, "setError", error);
            });
        }
    };
    return SearchkitManager;
})();
exports.SearchkitManager = SearchkitManager;
//# sourceMappingURL=SearchkitManager.js.map