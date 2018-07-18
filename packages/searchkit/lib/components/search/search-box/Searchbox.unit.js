var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var SearchBox_1 = require("./SearchBox");
var core_1 = require("../../../core");
var throttle = require('lodash/throttle');
var omit = require("lodash/omit");
describe("Searchbox tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.searchkit.translateFunction = function (key) {
            return {
                "searchbox.placeholder": "search movies",
                "searchbox.button": "Go"
            }[key];
        };
        _this.createWrapper = function (searchOnChange, queryFields, prefixQueryFields, options) {
            if (searchOnChange === void 0) { searchOnChange = false; }
            if (queryFields === void 0) { queryFields = null; }
            if (prefixQueryFields === void 0) { prefixQueryFields = null; }
            if (options === void 0) { options = {}; }
            _this.wrapper = enzyme_1.mount(React.createElement(SearchBox_1.SearchBox, __assign({ searchkit: _this.searchkit, searchOnChange: searchOnChange, queryFields: queryFields, prefixQueryFields: prefixQueryFields, queryOptions: { minimum_should_match: "60%" }, prefixQueryOptions: { minimum_should_match: "70%" } }, options)));
            _this.accessor = _this.searchkit.getAccessorByType(core_1.QueryAccessor);
        };
        _this.typeSearch = function (value) {
            _this.wrapper.find(".sk-search-box__text")
                .simulate("input", { target: { value: value } });
        };
    });
    it("render", function () {
        _this.createWrapper();
        expect(_this.wrapper.find(".sk-search-box__text").get(0).placeholder).toBe("search movies");
        expect(_this.wrapper.find(".sk-search-box__action").get(0).value).toEqual("Go");
    });
    it("search on change", function () {
        _this.createWrapper(true);
        _this.typeSearch("m");
        expect(_this.accessor.state.getValue()).toBe("m");
        expect(_this.searchkit.performSearch.calls.count()).toEqual(1);
        _this.typeSearch("ma");
        expect(_this.accessor.state.getValue()).toBe("ma");
        expect(_this.searchkit.performSearch.calls.count()).toEqual(1);
        _this.wrapper.node.throttledSearch.flush();
        expect(_this.searchkit.performSearch.calls.count()).toEqual(2);
    });
    describe("search on change with clock", function () {
        it("clock", function () {
            var queries = [];
            _this.searchkit.performSearch = function () {
                queries.push(_this.searchkit.buildQuery());
            };
            _this.createWrapper(true);
            expect(_this.wrapper.node.props.searchThrottleTime).toBe(200);
            _this.typeSearch("m");
            _this.wrapper.node.throttledSearch.flush();
            expect(queries.length).toBe(1);
            expect(queries[0].getQueryString()).toBe("m");
            _this.typeSearch("ma");
            expect(queries.length).toBe(1);
            _this.wrapper.node.throttledSearch.flush();
            expect(queries.length).toBe(2);
            expect(queries[1].getQueryString()).toBe("ma");
        });
    });
    it("search on submit", function () {
        _this.createWrapper(false);
        _this.typeSearch('m');
        _this.typeSearch('ma');
        expect(_this.accessor.state.getValue()).toBe(null);
        expect(_this.searchkit.performSearch.calls.count()).toEqual(0);
        _this.wrapper.find("form").simulate("submit");
        expect(_this.accessor.state.getValue()).toBe("ma");
        expect(_this.searchkit.performSearch.calls.count()).toEqual(1);
    });
    it("should configure accessor defaults correctly", function () {
        _this.createWrapper(false, ["title"]);
        expect(_this.accessor.key).toBe("q");
        var options = _this.accessor.options;
        expect(omit(options, "onQueryStateChange")).toEqual({
            queryFields: ["title"],
            prefixQueryFields: null,
            queryOptions: { minimum_should_match: "60%" },
            prefixQueryOptions: { minimum_should_match: "70%" },
            queryBuilder: undefined
        });
    });
    it("should configure accessor search on change correctly", function () {
        _this.createWrapper(true, ["title"]);
        expect(_this.accessor.key).toBe("q");
        var options = _this.accessor.options;
        expect(options).toEqual({
            queryFields: ["title"],
            prefixQueryFields: null,
            queryOptions: { minimum_should_match: "60%" },
            prefixQueryOptions: { minimum_should_match: "70%" },
            queryBuilder: undefined,
            onQueryStateChange: jasmine.any(Function)
        });
    });
    it("should configure accessor + prefix", function () {
        _this.createWrapper(true, ["title"], ["prefix"], { queryBuilder: core_1.QueryString });
        expect(_this.accessor.key).toBe("q");
        var options = _this.accessor.options;
        expect(options).toEqual({
            queryFields: ["title"],
            prefixQueryFields: ["prefix"],
            queryOptions: { minimum_should_match: "60%" },
            prefixQueryOptions: { minimum_should_match: "70%" },
            queryBuilder: core_1.QueryString,
            onQueryStateChange: jasmine.any(Function)
        });
    });
    it("should handle focus", function () {
        _this.createWrapper(true, ["title"], ["prefix"]);
        expect(_this.wrapper.find(".sk-search-box")
            .hasClass("is-focused")).toBe(false);
        expect(_this.wrapper.node.state)
            .toEqual({ focused: false, input: undefined });
        _this.wrapper.find(".sk-search-box__text")
            .simulate("focus");
        expect(_this.wrapper.node.state)
            .toEqual({ focused: true, input: undefined });
        _this.wrapper.update();
        expect(_this.wrapper.find(".sk-search-box")
            .hasClass("is-focused")).toBe(true);
    });
    describe("url change + blurAction", function () {
        it("blurAction:restore", function () {
            _this.createWrapper(false, ["title"], ["prefix"], {
                blurAction: "restore"
            });
            _this.typeSearch("la");
            expect(_this.wrapper.node.getValue()).toEqual("la");
            _this.accessor.fromQueryObject({
                q: "foo"
            });
            expect(_this.wrapper.node.getValue()).toEqual("foo");
            _this.typeSearch("bar");
            expect(_this.wrapper.node.getValue()).toEqual("bar");
            _this.wrapper.find(".sk-search-box__text")
                .simulate("blur");
            // should be restored to previous value
            expect(_this.wrapper.node.getValue()).toEqual("foo");
            expect(_this.searchkit.performSearch).not.toHaveBeenCalled();
        });
        it("blurAction:search", function () {
            _this.createWrapper(false, ["title"], ["prefix"], {
                blurAction: "search"
            });
            _this.typeSearch("la");
            expect(_this.wrapper.node.getValue()).toEqual("la");
            _this.accessor.fromQueryObject({
                q: "foo"
            });
            expect(_this.wrapper.node.getValue()).toEqual("foo");
            _this.typeSearch("bar");
            expect(_this.wrapper.node.getValue()).toEqual("bar");
            _this.wrapper.find(".sk-search-box__text")
                .simulate("blur");
            // should flush value + search
            expect(_this.wrapper.node.getValue()).toEqual("bar");
            expect(_this.searchkit.performSearch).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=Searchbox.unit.js.map