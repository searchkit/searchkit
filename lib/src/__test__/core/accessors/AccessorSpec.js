var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
var _1 = require("../../../");
describe("Accessor", function () {
    beforeEach(function () {
        var SomeAccessor = (function (_super) {
            __extends(SomeAccessor, _super);
            function SomeAccessor() {
                _super.apply(this, arguments);
                this.state = new _1.ValueState();
            }
            return SomeAccessor;
        })(_1.Accessor);
        _this.accessor = new SomeAccessor("genres.raw");
        _this.searchkit = new _1.SearchkitManager("/");
        _this.searcher = new _1.Searcher(_this.searchkit);
        _this.accessor.setSearcher(_this.searcher);
    });
    it("constructor()", function () {
        expect(_this.accessor.key).toEqual("genres.raw");
        expect(_this.accessor.urlKey).toEqual("genres_raw");
    });
    it("setSearcher()", function () {
        expect(_this.accessor.searcher).toBe(_this.searcher);
        expect(_this.accessor.state).toBe(_this.accessor.resultsState);
    });
    it("translate()", function () {
        _this.searcher.translate = function (key) {
            return { a: 'b' }[key];
        };
        expect(_this.accessor.translate("a")).toBe("b");
    });
    it("onStateChange()", function () {
        expect(function () { return _this.accessor.onStateChange({}); })
            .not.toThrow();
    });
    it("fromQueryObject", function () {
        var queryObject = {
            genres_raw: [1, 2],
            authors_raw: [3, 4]
        };
        _this.accessor.fromQueryObject(queryObject);
        expect(_this.accessor.state.getValue())
            .toEqual([1, 2]);
    });
    it("getQueryObject()", function () {
        _this.accessor.state = new _1.ValueState([1, 2]);
        expect(_this.accessor.getQueryObject())
            .toEqual({ genres_raw: [1, 2] });
    });
    it("getResults()", function () {
        _this.searcher.results = [1, 2];
        expect(_this.accessor.getResults()).toEqual([1, 2]);
    });
    it("setResultsState()", function () {
        delete _this.accessor.resultsState;
        expect(_this.accessor.state)
            .not.toBe(_this.accessor.resultsState);
        _this.accessor.setResultsState();
        expect(_this.accessor.state)
            .toBe(_this.accessor.resultsState);
    });
    it("resetState()", function () {
        _this.accessor.state = _this.accessor.state.setValue("foo");
        expect(_this.accessor.state.getValue()).toBe("foo");
        _this.accessor.resetState();
        expect(_this.accessor.state.getValue()).toBe(null);
    });
    it("buildSharedQuery", function () {
        var query = new _1.ImmutableQuery();
        expect(_this.accessor.buildSharedQuery(query))
            .toBe(query);
    });
    it("buildOwnQuery", function () {
        var query = new _1.ImmutableQuery();
        expect(_this.accessor.buildOwnQuery(query))
            .toBe(query);
    });
});
//# sourceMappingURL=AccessorSpec.js.map