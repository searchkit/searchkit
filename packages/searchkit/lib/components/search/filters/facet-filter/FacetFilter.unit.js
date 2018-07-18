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
var TestHelpers_1 = require("../../../__test__/TestHelpers");
var FacetFilter_1 = require("./FacetFilter");
var RefinementListFilter_1 = require("./RefinementListFilter");
var core_1 = require("../../../../core");
var ui_1 = require("../../../ui");
var _ = require("lodash");
var sinon = require("sinon");
describe("Facet Filter tests", function () {
    _this.createWrapper = function (component) {
        _this.wrapper = enzyme_1.mount(component);
        _this.searchkit.setResults({
            aggregations: {
                testId1: {
                    test: {
                        buckets: [
                            { key: "test option 1", doc_count: 1 },
                            { key: "test option 2", doc_count: 2 },
                            { key: "test option 3", doc_count: 3 }
                        ]
                    },
                    "test_count": {
                        value: 4
                    }
                }
            }
        });
        _this.accessor = _this.searchkit.getAccessorByType(core_1.FacetAccessor);
    };
    beforeEach(function () {
        core_1.Utils.guidCounter = 0;
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.searchkit.translateFunction = function (key) {
            return {
                "test option 1": "test option 1 translated"
            }[key];
        };
        _this.createWrapper(React.createElement(FacetFilter_1.FacetFilter, { field: "test", id: "testId", title: "test title", size: 3, countFormatter: function (count) { return "#" + count; }, include: "title", exclude: ["bad", "n/a"], operator: "OR", orderKey: "_count", orderDirection: "desc", translations: { "facets.view_all": "View all facets" }, searchkit: _this.searchkit, bucketsTransform: _.identity }));
        _this.getViewMore = function () { return _this.wrapper.find(".sk-refinement-list__view-more-action"); };
    });
    it('renders correctly', function () {
        expect(_this.wrapper).toMatchSnapshot();
    });
    it('clicks options', function () {
        var option = _this.wrapper.find(".sk-item-list").children().at(0);
        var option2 = _this.wrapper.find(".sk-item-list").children().at(1);
        TestHelpers_1.fastClick(option);
        TestHelpers_1.fastClick(option2);
        expect(TestHelpers_1.hasClass(option, "is-active")).toBe(true);
        expect(TestHelpers_1.hasClass(option2, "is-active")).toBe(true);
        expect(_this.accessor.state.getValue()).toEqual(['test option 1', 'test option 2']);
        TestHelpers_1.fastClick(option2);
        expect(_this.accessor.state.getValue()).toEqual(['test option 1']);
    });
    it("show more options", function () {
        var option = { label: "view more", size: 20 };
        _this.accessor.getMoreSizeOption = function () { return option; };
        _this.accessor.setViewMoreOption = sinon.spy();
        _this.wrapper.update();
        var viewMore = _this.getViewMore();
        expect(viewMore.text()).toBe("view more");
        TestHelpers_1.fastClick(viewMore);
        _this.wrapper.update();
        expect(_this.accessor.setViewMoreOption.calledOnce).toBe(true);
        expect(_this.accessor.setViewMoreOption.calledWith(option)).toBe(true);
    });
    it("show no options", function () {
        _this.accessor.getMoreSizeOption = function () { return null; };
        _this.wrapper.update();
        expect(_this.getViewMore().length).toBe(0);
    });
    it("should configure accessor correctly", function () {
        expect(_this.accessor.key).toBe("testId");
        var options = _this.accessor.options;
        expect(options).toEqual(jasmine.objectContaining({
            "id": "testId",
            "field": "test",
            "title": "test title",
            "size": 3,
            "facetsPerPage": 50,
            "operator": "OR",
            "translations": { "facets.view_all": "View all facets" },
            "orderKey": "_count",
            "orderDirection": "desc",
            "include": "title",
            "exclude": ["bad", "n/a"],
            "fieldOptions": {
                type: "embedded",
                field: "test"
            }
        }));
    });
    it("should work with a custom itemComponent", function () {
        _this.createWrapper(React.createElement(FacetFilter_1.FacetFilter, { itemComponent: function (_a) {
                var label = _a.label, count = _a.count;
                return React.createElement("div", { className: "option" },
                    label,
                    " (",
                    count,
                    ")");
            }, field: "test", id: "testId", title: "test title", searchkit: _this.searchkit }));
        expect(_this.wrapper.find(".sk-panel__header").text()).toBe("test title");
        expect(_this.wrapper.find(".option").map(function (e) { return e.text(); }))
            .toEqual(["test option 1 translated (1)", "test option 2 (2)", "test option 3 (3)"]);
    });
    it("operator can be updated", function () {
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper.setProps({ operator: "AND" });
        expect(_this.accessor.options.operator).toBe("AND");
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
    });
    it("setFilters", function () {
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper.node.setFilters(["foo"]);
        expect(_this.accessor.state.getValue()).toEqual(["foo"]);
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
    });
    it("should work with custom components", function () {
        var container = function (props) { return (React.createElement("div", __assign({}, props), props.children)); };
        _this.createWrapper(React.createElement(RefinementListFilter_1.RefinementListFilter, { containerComponent: container, listComponent: ui_1.Toggle, itemComponent: function (props) { return React.createElement(ui_1.ItemComponent, __assign({}, props, { showCount: true })); }, field: "test", id: "testId", title: "test title", bucketsTransform: function (buckets) { return _.reverse(buckets); }, searchkit: _this.searchkit }));
        expect(_this.wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=FacetFilter.unit.js.map