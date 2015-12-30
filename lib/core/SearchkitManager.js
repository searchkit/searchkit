var ImmutableQuery_1 = require("./query/ImmutableQuery");
var Searcher_1 = require("./Searcher");
var history_1 = require("./history");
var SearcherCollection_1 = require("./SearcherCollection");
var SearchRequest_1 = require("./SearchRequest");
var support_1 = require("./support");
var _ = require("lodash");
require('es6-promise').polyfill();
var SearchkitManager = (function () {
    function SearchkitManager(host, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.options = _.defaults(options, {
            multipleSearchers: false,
            useHistory: true
        });
        this.host = host;
        this.searchers = new SearcherCollection_1.SearcherCollection();
        this.registrationCompleted = new Promise(function (resolve) {
            _this.completeRegistration = resolve;
        });
        this.defaultQueries = [];
        this.translateFunction = _.identity;
        this.multipleSearchers = this.options.multipleSearchers;
        this.primarySearcher = this.createSearcher();
        if (this.options.useHistory) {
            this.history = history_1.createHistory();
            this.listenToHistory();
        }
    }
    SearchkitManager.prototype.addSearcher = function (searcher) {
        return this.searchers.add(searcher);
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
    SearchkitManager.prototype.buildSharedQuery = function () {
        var sharedQuery = support_1.Utils.collapse(this.defaultQueries, new ImmutableQuery_1.ImmutableQuery());
        return this.searchers.buildSharedQuery(sharedQuery);
    };
    SearchkitManager.prototype.buildQuery = function () {
        var sharedQuery = this.buildSharedQuery();
        this.searchers.buildQuery(sharedQuery);
    };
    SearchkitManager.prototype.resetState = function () {
        this.searchers.resetState();
    };
    SearchkitManager.prototype.unlistenHistory = function () {
        if (this.options.useHistory && this._unlistenHistory) {
            this._unlistenHistory();
        }
    };
    SearchkitManager.prototype.listenToHistory = function () {
        var _this = this;
        this._unlistenHistory = this.history.listen(function (location) {
            //action is POP when the browser modified
            if (location.action === "POP") {
                _this.registrationCompleted.then(function () {
                    _this.searchers.setAccessorStates(location.query);
                    _this._search();
                }).catch(function (e) {
                    console.log(e.stack);
                });
            }
        });
    };
    SearchkitManager.prototype.performSearch = function () {
        this.searchers.notifyStateChange(this.state);
        var hasSearched = this._search();
        if (hasSearched && this.options.useHistory) {
            this.history.pushState(null, window.location.pathname, this.state);
        }
    };
    SearchkitManager.prototype.search = function () {
        this.performSearch();
    };
    SearchkitManager.prototype._search = function () {
        this.state = this.searchers.getState();
        this.buildQuery();
        var changedSearchers = this.searchers.getChangedSearchers();
        var hasChanged = changedSearchers.size() > 0;
        if (hasChanged) {
            this.currentSearchRequest && this.currentSearchRequest.deactivate();
            this.currentSearchRequest = new SearchRequest_1.SearchRequest(this.host, this.searchers.getChangedSearchers());
            this.currentSearchRequest.run();
        }
        return hasChanged;
    };
    return SearchkitManager;
})();
exports.SearchkitManager = SearchkitManager;
//# sourceMappingURL=SearchkitManager.js.map