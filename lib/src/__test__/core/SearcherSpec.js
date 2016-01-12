var _this = this;
var _1 = require("../../");
describe("Searcher", function () {
    beforeEach(function () {
        _this.searchkit = new _1.SearchkitManager("/", { useHistory: false });
        _this.searcher = new _1.Searcher(_this.searchkit);
        _this.emitterSpy = jasmine.createSpy("emitter");
        _this.searcher.emitter.addListener(_this.emitterSpy);
        _this.accessor = new _1.PageSizeAccessor("p", 10);
    });
    it("constructor()", function () {
        expect(_this.searcher.accessors)
            .toEqual([]);
        expect(_this.searcher.query)
            .toEqual(jasmine.any(_1.ImmutableQuery));
        expect(_this.searcher.emitter)
            .toEqual(jasmine.any(_1.EventEmitter));
        expect(_this.searcher.searchkitManager)
            .toBe(_this.searchkit);
        expect(_this.searcher.initialLoading)
            .toBe(true);
    });
    it("translate()", function () {
        _this.searchkit.translateFunction = function (key) { return key + "bar"; };
        expect(_this.searcher.translate("foo"))
            .toBe("foobar");
        delete _this.searcher.searchkitManager;
        expect(_this.searcher.translate("foo"))
            .toBe("foo");
    });
    it("hasFiltersOrQuery()", function () {
        expect(_this.searcher.hasFiltersOrQuery()).toBe(false);
        _this.searcher.query = _this.searcher.query.setSort("title");
        expect(_this.searcher.hasFiltersOrQuery()).toBe(true);
    });
    it("addAccessor()", function () {
        _this.searcher.addAccessor(_this.accessor);
        expect(_this.searcher.accessors).toEqual([
            _this.accessor
        ]);
        expect(_this.accessor.searcher)
            .toBe(_this.searcher);
    });
    it("clearQuery()", function () {
        expect(_this.searcher.query).toBeDefined();
        _this.searcher.clearQuery();
        expect(_this.searcher.query).not.toBeDefined();
    });
    describe("buildQuery()", function () {
        beforeEach(function () {
            spyOn(_this.searcher, "beginNewSearch");
            _this.sharedQuery = new _1.ImmutableQuery()
                .setSize(10);
            _this.searcher.addAccessor(_this.accessor);
            _this.searcher.query = _this.sharedQuery;
        });
        it("query not changed", function () {
            var newQuery = _this.searcher.buildQuery(_this.sharedQuery);
            expect(_this.searcher.queryHasChanged)
                .toBe(false);
            expect(_this.searcher.beginNewSearch)
                .not.toHaveBeenCalled();
            expect(newQuery).toBe(_this.searcher.query);
        });
        it("query changed", function () {
            _this.accessor.size = 20;
            var newQuery = _this.searcher.buildQuery(_this.sharedQuery);
            expect(_this.searcher.queryHasChanged).toBe(true);
            expect(_this.searcher.beginNewSearch).toHaveBeenCalled();
            expect(_this.searcher.query.getSize()).toBe(20);
        });
    });
    it("beginNewSearch()", function () {
        _this.searcher.error = new Error("oh no");
        _this.searcher.beginNewSearch();
        expect(_this.searcher.error).toBe(null);
        expect(_this.searcher.loading).toBe(true);
        expect(_this.emitterSpy).toHaveBeenCalled();
    });
    it("getResults()", function () {
        _this.searcher.setResults([1, 2, 3]);
        expect(_this.searcher.getResults())
            .toEqual([1, 2, 3]);
    });
    it("setResults()", function () {
        spyOn(_this.accessor, "setResultsState");
        _this.searcher.addAccessor(_this.accessor);
        _this.searcher.loading = true;
        _this.searcher.setResults([1, 2, 3]);
        expect(_this.searcher.results).toEqual([1, 2, 3]);
        expect(_this.searcher.loading).toBe(false);
        expect(_this.searcher.initialLoading).toBe(false);
        expect(_this.accessor.setResultsState)
            .toHaveBeenCalled();
        expect(_this.emitterSpy).toHaveBeenCalled();
    });
    it("setError()", function () {
        var error = new Error("oh no");
        _this.searcher.loading = true;
        _this.searcher.setError(error);
        expect(_this.searcher.error).toBe(error);
        expect(_this.searcher.loading).toBe(false);
        expect(_this.searcher.initialLoading).toBe(false);
        expect(_this.emitterSpy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=SearcherSpec.js.map