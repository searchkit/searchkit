var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var SearchBox_tsx_1 = require("../src/SearchBox.tsx");
var core_1 = require("../../../../core");
var bem = require("bem-cn");
var sinon = require("sinon");
describe("Searchbox tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: true });
        _this.searchkit.translateFunction = function (key) {
            return {
                "searchbox.placeholder": "search movies",
            }[key];
        };
        _this.createWrapper = function (searchOnChange, queryFields, prefixQueryFields) {
            if (searchOnChange === void 0) { searchOnChange = false; }
            if (queryFields === void 0) { queryFields = null; }
            if (prefixQueryFields === void 0) { prefixQueryFields = null; }
            _this.wrapper = enzyme_1.mount(React.createElement(SearchBox_tsx_1.SearchBox, {"searchkit": _this.searchkit, "searchOnChange": searchOnChange, "queryFields": queryFields, "prefixQueryFields": prefixQueryFields}));
            _this.accessor = _this.searchkit.accessors.getAccessors()[0];
        };
    });
    fit("render", function () {
        _this.createWrapper();
        expect(_this.wrapper.find(".search-box__text").get(0).placeholder).toBe("search movies");
    });
    it("search on change", function () {
        var spy = sinon.spy();
        _this.searchkit.performSearch = spy;
        _this.createWrapper(true);
        _this.wrapper.find(".search-box__text").simulate("input", { target: { value: 'm' } }).simulate("input", { target: { value: 'ma' } });
        expect(_this.accessor.state.getValue()).toBe("ma");
        expect(spy.callCount).toBe(2);
    });
    it("search on submit", function () {
        var spy = sinon.spy();
        _this.searchkit.performSearch = spy;
        _this.createWrapper(false);
        _this.wrapper.find(".search-box__text").simulate("input", { target: { value: 'm' } }).simulate("input", { target: { value: 'ma' } });
        expect(_this.accessor.state.getValue()).toBe("ma");
        expect(spy.callCount).toBe(0);
        _this.wrapper.find("form").simulate("submit");
        expect(spy.callCount).toBe(1);
    });
    it("should configure accessor defaults correctly", function () {
        _this.createWrapper(false, ["title"]);
        expect(_this.accessor.key).toBe("q");
        var options = _this.accessor.options;
        expect(options).toEqual({
            "queryFields": ["title"],
            prefixQueryFields: false,
            "queryOptions": {}
        });
    });
    it("should configure accessor search on change correctly", function () {
        _this.createWrapper(true, ["title"]);
        expect(_this.accessor.key).toBe("q");
        var options = _this.accessor.options;
        expect(options).toEqual({
            "queryFields": ["title"],
            prefixQueryFields: ["title"],
            "queryOptions": {}
        });
    });
    it("should configure accessor + prefix", function () {
        _this.createWrapper(true, ["title"], ["prefix"]);
        expect(_this.accessor.key).toBe("q");
        var options = _this.accessor.options;
        expect(options).toEqual({
            "queryFields": ["title"],
            prefixQueryFields: ["prefix"],
            "queryOptions": {}
        });
    });
});
//# sourceMappingURL=SearchboxSpec.js.map