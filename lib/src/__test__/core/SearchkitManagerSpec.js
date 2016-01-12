var _this = this;
var _1 = require("../../");
describe("SearchkitManager", function () {
    beforeEach(function () {
        _this.host = "http://localhost:9200";
        _this.searchkit = new _1.SearchkitManager(_this.host, {
            multipleSearchers: true,
            useHistory: false,
            httpHeaders: {
                "Content-Type": "application/json"
            },
            basicAuth: "key:val"
        });
        _this.searchers = _this.searchkit.searchers;
    });
    afterEach(function () {
        _this.searchkit.unlistenHistory();
    });
    it("constructor()", function () {
        expect(_this.searchkit.host).toBe(_this.host);
        expect(_this.searchkit.searchers)
            .toEqual(jasmine.any(_1.SearcherCollection));
        expect(_this.searchkit.registrationCompleted).toEqual(jasmine.any(Promise));
        expect(_this.searchkit.defaultQueries).toEqual([]);
        expect(_this.searchkit.translateFunction)
            .toEqual(jasmine.any(Function));
        expect(_this.searchkit.multipleSearchers).toBe(true);
        expect(_this.searchkit.primarySearcher)
            .toEqual(jasmine.any(_1.Searcher));
        expect(_this.searchkit.transport)
            .toEqual(jasmine.any(_1.ESTransport));
        expect(_this.searchkit.transport.options.headers).toEqual(jasmine.objectContaining({
            "Content-Type": "application/json",
            "Authorization": jasmine.any(String)
        }));
    });
    it("addSearcher()", function () {
        var searcher = new _1.Searcher(_this.searchkit);
        _this.searchkit.addSearcher(searcher);
        expect(_this.searchkit.searchers.searchers).toEqual([
            _this.searchkit.primarySearcher, searcher
        ]);
    });
    it("addDefaultQuery()", function () {
        var queryFn = function () { };
        _this.searchkit.addDefaultQuery(queryFn);
        expect(_this.searchkit.defaultQueries)
            .toEqual([queryFn]);
    });
    it("translate()", function () {
        spyOn(_this.searchkit, "translateFunction")
            .and.callThrough();
        expect(_this.searchkit.translate("foo")).toBe("foo");
        expect(_this.searchkit.translateFunction)
            .toHaveBeenCalledWith("foo");
    });
    it("createSearcher()", function () {
        _this.searchers.searchers = [];
        var searcher = _this.searchkit.createSearcher();
        expect(_this.searchers.searchers)
            .toEqual([searcher]);
        expect(searcher.searchkitManager)
            .toBe(_this.searchkit);
    });
    it("buildSharedQuery()", function () {
        var defaultQueryFn = function (query) {
            return query.setSize(10);
        };
        _this.searchkit.addDefaultQuery(defaultQueryFn);
        _this.searchers.buildSharedQuery = function (query) {
            return query.setFrom(5);
        };
        var sharedQuery = _this.searchkit.buildSharedQuery();
        expect(sharedQuery.getSize()).toBe(10);
        expect(sharedQuery.getFrom()).toBe(5);
    });
    it("buildQuery()", function () {
        spyOn(_this.searchers, "buildQuery");
        var query = new _1.ImmutableQuery();
        _this.searchkit.buildSharedQuery = function () { return query; };
        _this.searchkit.buildQuery();
        expect(_this.searchers.buildQuery)
            .toHaveBeenCalledWith(query);
    });
    it("resetState()", function () {
        spyOn(_this.searchers, "resetState");
        _this.searchkit.resetState();
        expect(_this.searchers.resetState)
            .toHaveBeenCalled();
    });
    it("listenToHistory()", function (done) {
        var history = _1.createHistory();
        history.pushState(null, window.location.pathname, {
            q: "foo"
        });
        var searchkit = new _1.SearchkitManager("/", {
            useHistory: true
        });
        spyOn(searchkit.searchers, "setAccessorStates");
        spyOn(searchkit, "_search");
        searchkit.completeRegistration();
        setTimeout(function () {
            expect(searchkit._search).toHaveBeenCalled();
            expect(searchkit.searchers.setAccessorStates)
                .toHaveBeenCalledWith({ q: "foo" });
            done();
        }, 0);
    });
    it("performSearch()", function () {
        var searchkit = new _1.SearchkitManager("/", {
            useHistory: true
        });
        searchkit.state = {
            q: "foo"
        };
        spyOn(searchkit.searchers, "notifyStateChange");
        spyOn(searchkit, "_search").and.returnValue(true);
        spyOn(searchkit.history, "pushState");
        searchkit.performSearch();
        expect(searchkit.history.pushState).toHaveBeenCalledWith(null, jasmine.any(String), { q: "foo" });
    });
    it("search()", function () {
        spyOn(_this.searchkit, "performSearch");
        _this.searchkit.search();
        expect(_this.searchkit.performSearch)
            .toHaveBeenCalled();
    });
    it("_search()", function () {
        spyOn(_1.SearchRequest.prototype, "run");
        _this.accessor = new _1.PageSizeAccessor("s", 10);
        var initialSearchRequest = _this.searchkit.currentSearchRequest = new _1.SearchRequest(_this.host, null);
        _this.searchkit.primarySearcher.addAccessor(_this.accessor);
        expect(_this.searchkit._search())
            .toBe(true);
        expect(initialSearchRequest.active).toBe(false);
        expect(_this.searchkit.currentSearchRequest.transport.host)
            .toBe(_this.host);
        expect(_this.searchkit.currentSearchRequest.searchers)
            .toEqual(_this.searchers);
        expect(_this.searchkit.currentSearchRequest.run)
            .toHaveBeenCalled();
    });
});
//# sourceMappingURL=SearchkitManagerSpec.js.map