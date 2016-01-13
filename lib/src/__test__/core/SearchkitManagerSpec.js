var _this = this;
var _1 = require("../../");
describe("SearchkitManager", function () {
    beforeEach(function () {
        _this.host = "http://localhost:9200";
        _this.searchkit = new _1.SearchkitManager(_this.host, {
            useHistory: false,
            httpHeaders: {
                "Content-Type": "application/json"
            },
            basicAuth: "key:val"
        });
        _this.emitterSpy = jasmine.createSpy("emitter");
        _this.searchkit.emitter.addListener(_this.emitterSpy);
        _this.accessors = _this.searchkit.accessors;
    });
    it("constructor()", function () {
        var semverRegex = /^\d+\.\d+\.\d+-?\w*$/;
        expect(_this.searchkit.VERSION).toMatch(semverRegex);
        expect(_1.SearchkitManager.VERSION).toMatch(semverRegex);
        expect(_this.searchkit.host).toBe(_this.host);
        expect(_this.searchkit.accessors)
            .toEqual(jasmine.any(_1.AccessorManager));
        expect(_this.searchkit.registrationCompleted).toEqual(jasmine.any(Promise));
        expect(_this.searchkit.defaultQueries).toEqual([]);
        expect(_this.searchkit.translateFunction)
            .toEqual(jasmine.any(Function));
        expect(_this.searchkit.transport)
            .toEqual(jasmine.any(_1.AxiosESTransport));
        expect(_this.searchkit.transport.options.headers).toEqual(jasmine.objectContaining({
            "Content-Type": "application/json",
            "Authorization": jasmine.any(String)
        }));
        expect(_this.searchkit.query).toEqual(new _1.ImmutableQuery());
        expect(_this.searchkit.emitter).toEqual(jasmine.any(_1.EventEmitter));
        expect(_this.searchkit.initialLoading).toBe(true);
    });
    it("addAccessor()", function () {
        var accessor = new _1.PageSizeAccessor(10);
        _this.searchkit.addAccessor(accessor);
        expect(_this.searchkit.accessors.accessors).toEqual([
            accessor
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
        expect(_this.searchkit.translate("foo")).toBe(undefined);
        expect(_this.searchkit.translateFunction)
            .toHaveBeenCalledWith("foo");
    });
    it("buildQuery()", function () {
        var defaultQueryFn = function (query) {
            return query.setFrom(20);
        };
        _this.searchkit.addDefaultQuery(defaultQueryFn);
        _this.searchkit.addAccessor(new _1.PageSizeAccessor(10));
        var query = _this.searchkit.buildQuery();
        expect(query.getSize()).toBe(10);
        expect(query.getFrom()).toBe(20);
    });
    it("resetState()", function () {
        spyOn(_this.accessors, "resetState");
        _this.searchkit.resetState();
        expect(_this.accessors.resetState)
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
        spyOn(searchkit.accessors, "setState");
        spyOn(searchkit, "_search");
        searchkit.completeRegistration();
        setTimeout(function () {
            expect(searchkit._search).toHaveBeenCalled();
            expect(searchkit.accessors.setState)
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
        spyOn(searchkit.accessors, "notifyStateChange");
        spyOn(searchkit, "_search").and.returnValue(true);
        spyOn(searchkit.history, "pushState");
        searchkit.performSearch();
        expect(searchkit.history.pushState).toHaveBeenCalledWith(null, jasmine.any(String), { q: "foo" });
        expect(searchkit.accessors.notifyStateChange)
            .toHaveBeenCalledWith(searchkit.state);
        searchkit.unlistenHistory();
    });
    it("performSearch() - same state + replaceState", function () {
        var searchkit = new _1.SearchkitManager("/", {
            useHistory: true
        });
        searchkit.state = {
            q: "foo"
        };
        searchkit.accessors.getState = function () {
            return { q: "foo" };
        };
        spyOn(searchkit.accessors, "notifyStateChange");
        spyOn(searchkit, "_search").and.returnValue(true);
        spyOn(searchkit.history, "replaceState");
        searchkit.performSearch(true);
        expect(searchkit.history.replaceState)
            .toHaveBeenCalled();
        expect(searchkit.accessors.notifyStateChange)
            .not.toHaveBeenCalled();
        searchkit.unlistenHistory();
    });
    it("search()", function () {
        spyOn(_this.searchkit, "performSearch");
        _this.searchkit.search();
        expect(_this.searchkit.performSearch)
            .toHaveBeenCalled();
    });
    it("_search()", function () {
        spyOn(_1.SearchRequest.prototype, "run");
        _this.accessor = new _1.PageSizeAccessor(10);
        var initialSearchRequest = _this.searchkit.currentSearchRequest = new _1.SearchRequest(_this.host, null, _this.searchkit);
        _this.searchkit.addAccessor(_this.accessor);
        _this.searchkit._search();
        expect(initialSearchRequest.active).toBe(false);
        expect(_this.searchkit.currentSearchRequest.transport.host)
            .toBe(_this.host);
        expect(_this.searchkit.currentSearchRequest.query)
            .toEqual(_this.searchkit.query);
        expect(_this.searchkit.currentSearchRequest.run)
            .toHaveBeenCalled();
        expect(_this.searchkit.loading).toBe(true);
    });
    it("setResults()", function () {
        spyOn(_this.accessors, "setResults");
        spyOn(_this.searchkit, "onResponseChange");
        expect(_this.searchkit.results).toBe(undefined);
        _this.searchkit.setResults("foo");
        expect(_this.searchkit.results).toBe("foo");
        expect(_this.accessors.setResults)
            .toHaveBeenCalledWith("foo");
        expect(_this.searchkit.onResponseChange)
            .toHaveBeenCalled();
    });
    it("setResults()", function () {
        spyOn(_this.searchkit, "onResponseChange");
        expect(_this.searchkit.results).toBe(undefined);
        var error = new Error("oh no");
        _this.searchkit.setError(error);
        expect(_this.searchkit.error).toBe(error);
        expect(_this.searchkit.onResponseChange)
            .toHaveBeenCalled();
    });
    it("onResponseChange()", function () {
        _this.searchkit.loading = true;
        _this.searchkit.initialLoading = true;
        _this.searchkit.onResponseChange();
        expect(_this.searchkit.loading).toBe(false);
        expect(_this.searchkit.initialLoading).toBe(false);
        expect(_this.emitterSpy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=SearchkitManagerSpec.js.map