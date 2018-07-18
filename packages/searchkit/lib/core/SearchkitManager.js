var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var query_1 = require("./query");
var accessors_1 = require("./accessors");
var AccessorManager_1 = require("./AccessorManager");
var transport_1 = require("./transport");
var SearchRequest_1 = require("./SearchRequest");
var support_1 = require("./support");
var SearchkitVersion_1 = require("./SearchkitVersion");
var history_1 = require("./history");
var defaults = require("lodash/defaults");
var constant = require("lodash/constant");
var identity = require("lodash/identity");
var map = require("lodash/map");
var isEqual = require("lodash/isEqual");
var get = require("lodash/get");
var SearchkitManager = /** @class */ (function () {
    function SearchkitManager(host, options, initialState) {
        if (options === void 0) { options = {}; }
        if (initialState === void 0) { initialState = {}; }
        var _this = this;
        this.VERSION = SearchkitVersion_1.VERSION;
        this.options = defaults(options, {
            useHistory: true,
            httpHeaders: {},
            searchOnLoad: true,
            defaultSize: 20,
            createHistory: history_1.createHistoryInstance,
            getLocation: function () { return typeof window !== 'undefined' && window.location; }
        });
        this.host = host;
        this.guidGenerator = new support_1.GuidGenerator();
        this.results = initialState.results;
        this.state = initialState.state || {};
        this.transport = this.options.transport || new transport_1.AxiosESTransport(host, {
            headers: this.options.httpHeaders,
            basicAuth: this.options.basicAuth,
            searchUrlPath: this.options.searchUrlPath,
            timeout: this.options.timeout,
            withCredentials: this.options.withCredentials
        });
        this.accessors = new AccessorManager_1.AccessorManager();
        this.accessors.add(new accessors_1.PageSizeAccessor(this.options.defaultSize));
        this.registrationCompleted = new Promise(function (resolve) {
            _this.completeRegistration = resolve;
        });
        this.translateFunction = constant(undefined);
        this.queryProcessor = identity;
        this.shouldPerformSearch = function () { return true; };
        this.query = new query_1.ImmutableQuery();
        this.emitter = new support_1.EventEmitter();
        this.resultsEmitter = new support_1.EventEmitter();
    }
    SearchkitManager.mock = function (options) {
        if (options === void 0) { options = {}; }
        var searchkit = new SearchkitManager("/", __assign({ useHistory: false, transport: new transport_1.MockESTransport() }, options));
        searchkit.setupListeners();
        return searchkit;
    };
    SearchkitManager.prototype.setupListeners = function () {
        this.initialLoading = !this.results;
        if (this.options.useHistory) {
            this.unlistenHistory();
            this.history = this.options.createHistory();
            this.listenToHistory();
        }
        this.runInitialSearch();
    };
    SearchkitManager.prototype.addAccessor = function (accessor) {
        accessor.setSearchkitManager(this);
        return this.accessors.add(accessor);
    };
    SearchkitManager.prototype.removeAccessor = function (accessor) {
        this.accessors.remove(accessor);
    };
    SearchkitManager.prototype.addDefaultQuery = function (fn) {
        return this.addAccessor(new accessors_1.AnonymousAccessor(fn));
    };
    SearchkitManager.prototype.setQueryProcessor = function (fn) {
        this.queryProcessor = fn;
    };
    SearchkitManager.prototype.translate = function (key) {
        return this.translateFunction(key);
    };
    SearchkitManager.prototype.buildQuery = function () {
        return this.accessors.buildQuery();
    };
    SearchkitManager.prototype.resetState = function () {
        this.accessors.resetState();
    };
    SearchkitManager.prototype.addResultsListener = function (fn) {
        return this.resultsEmitter.addListener(fn);
    };
    SearchkitManager.prototype.unlistenHistory = function () {
        if (this.options.useHistory && this._unlistenHistory) {
            this._unlistenHistory();
        }
    };
    SearchkitManager.prototype.listenToHistory = function () {
        var _this = this;
        this._unlistenHistory = this.history.listen(function (location, action) {
            if (action === "POP") {
                _this._searchWhenCompleted(location);
            }
        });
    };
    SearchkitManager.prototype._searchWhenCompleted = function (location) {
        var _this = this;
        this.registrationCompleted.then(function () {
            _this.searchFromUrlQuery(location.search);
        }).catch(function (e) {
            console.error(e.stack);
        });
    };
    SearchkitManager.prototype.runInitialSearch = function () {
        if (this.options.searchOnLoad) {
            this._searchWhenCompleted(this.options.getLocation());
        }
    };
    SearchkitManager.prototype.searchFromUrlQuery = function (query) {
        query = history_1.decodeObjString(query.replace(/^\?/, ""));
        this.accessors.setState(query);
        return this._search();
    };
    SearchkitManager.prototype.performSearch = function (replaceState, notifyState) {
        if (replaceState === void 0) { replaceState = false; }
        if (notifyState === void 0) { notifyState = true; }
        if (notifyState && !isEqual(this.accessors.getState(), this.state)) {
            this.accessors.notifyStateChange(this.state);
        }
        var searchPromise = this._search();
        if (this.options.useHistory) {
            var historyMethod = (replaceState) ?
                this.history.replace : this.history.push;
            var url = this.options.getLocation().pathname + "?" + history_1.encodeObjUrl(this.state);
            historyMethod.call(this.history, url);
        }
        return searchPromise;
    };
    SearchkitManager.prototype.buildSearchUrl = function (extraParams) {
        if (extraParams === void 0) { extraParams = {}; }
        var params = defaults(extraParams, this.state || this.accessors.getState());
        return this.options.getLocation().pathname + '?' + history_1.encodeObjUrl(params);
    };
    SearchkitManager.prototype.reloadSearch = function () {
        delete this.query;
        return this.performSearch();
    };
    SearchkitManager.prototype.search = function (replaceState) {
        if (replaceState === void 0) { replaceState = false; }
        return this.performSearch(replaceState);
    };
    SearchkitManager.prototype.getResultsAndState = function () {
        return {
            results: this.results,
            state: this.state
        };
    };
    SearchkitManager.prototype._search = function () {
        var _this = this;
        this.state = this.accessors.getState();
        var query = this.buildQuery();
        if (!this.shouldPerformSearch(query)) {
            return Promise.resolve(this.getResultsAndState());
        }
        if (this.results && this.query && isEqual(query.getJSON(), this.query.getJSON())) {
            return Promise.resolve(this.getResultsAndState());
        }
        this.query = query;
        this.loading = true;
        this.emitter.trigger();
        var queryObject = this.queryProcessor(this.query.getJSON());
        this.currentSearchRequest && this.currentSearchRequest.deactivate();
        this.currentSearchRequest = new SearchRequest_1.SearchRequest(this.transport, queryObject, this);
        return this.currentSearchRequest.run()
            .then(function () {
            return _this.getResultsAndState();
        });
    };
    SearchkitManager.prototype.setResults = function (results) {
        this.compareResults(this.results, results);
        this.results = results;
        this.error = null;
        this.accessors.setResults(results);
        this.onResponseChange();
        this.resultsEmitter.trigger(this.results);
    };
    SearchkitManager.prototype.compareResults = function (previousResults, results) {
        var ids = map(get(results, ["hits", "hits"], []), "_id").join(",");
        var previousIds = get(previousResults, ["hits", "ids"], "");
        if (results.hits) {
            results.hits.ids = ids;
            results.hits.hasChanged = !(ids && ids === previousIds);
        }
    };
    SearchkitManager.prototype.guid = function (prefix) {
        return this.guidGenerator.guid(prefix);
    };
    SearchkitManager.prototype.getHits = function () {
        return get(this.results, ["hits", "hits"], []);
    };
    SearchkitManager.prototype.getHitsCount = function () {
        return get(this.results, ["hits", "total"], 0);
    };
    SearchkitManager.prototype.getTime = function () {
        return get(this.results, "took", 0);
    };
    SearchkitManager.prototype.getSuggestions = function () {
        return get(this.results, ["suggest", "suggestions"], {});
    };
    SearchkitManager.prototype.getQueryAccessor = function () {
        return this.accessors.queryAccessor;
    };
    SearchkitManager.prototype.getAccessorsByType = function (type) {
        return this.accessors.getAccessorsByType(type);
    };
    SearchkitManager.prototype.getAccessorByType = function (type) {
        return this.accessors.getAccessorByType(type);
    };
    SearchkitManager.prototype.hasHits = function () {
        return this.getHitsCount() > 0;
    };
    SearchkitManager.prototype.hasHitsChanged = function () {
        return get(this.results, ["hits", "hasChanged"], true);
    };
    SearchkitManager.prototype.setError = function (error) {
        this.error = error;
        console.error(this.error);
        this.results = null;
        this.accessors.setResults(null);
        this.onResponseChange();
    };
    SearchkitManager.prototype.onResponseChange = function () {
        this.loading = false;
        this.initialLoading = false;
        this.emitter.trigger();
    };
    SearchkitManager.VERSION = SearchkitVersion_1.VERSION;
    return SearchkitManager;
}());
exports.SearchkitManager = SearchkitManager;
//# sourceMappingURL=SearchkitManager.js.map