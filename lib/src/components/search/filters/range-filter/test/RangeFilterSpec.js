var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var RangeFilter_tsx_1 = require("../src/RangeFilter.tsx");
var core_1 = require("../../../../../core");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
describe("Reset Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.createWrapper = function (withHistogram) {
            _this.wrapper = enzyme_1.mount(React.createElement(RangeFilter_tsx_1.RangeFilter, {"id": "m", "searchkit": _this.searchkit, "field": "metascore", "min": 0, "max": 100, "title": "metascore", "showHistogram": withHistogram}));
            _this.searchkit.setResults({
                "aggregations": {
                    "m": {
                        "m": {
                            "buckets": [
                                { key: "10", doc_count: 1 },
                                { key: "20", doc_count: 3 },
                                { key: "30", doc_count: 1 },
                                { key: "40", doc_count: 1 },
                                { key: "50", doc_count: 1 },
                                { key: "60", doc_count: 5 },
                                { key: "70", doc_count: 1 },
                                { key: "80", doc_count: 1 },
                                { key: "90", doc_count: 1 },
                                { key: "100", doc_count: 1 }
                            ]
                        }
                    }
                }
            });
            _this.wrapper.update();
            _this.accessor = _this.searchkit.accessors.getAccessors()[0];
        };
    });
    it("accessor has correct config", function () {
        _this.createWrapper(true);
        expect(_this.accessor.options).toEqual({
            id: "m",
            min: 0,
            max: 100,
            field: "metascore",
            title: "metascore"
        });
    });
    it('renders correctly', function () {
        _this.createWrapper(true);
        expect(_this.wrapper.html()).toEqual(TestHelpers_1.jsxToHTML(React.createElement("div", {"className": "range-filter"}, React.createElement("div", {"className": "range-filter__header"}, "metascore"), React.createElement("div", {"className": "bar-chart"}, React.createElement("div", {"className": "bar-chart__bar", "style": { height: "20%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "60%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "20%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "20%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "20%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "100%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "20%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "20%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "20%" }}), React.createElement("div", {"className": "bar-chart__bar", "style": { height: "20%" }})), React.createElement("div", {"className": "rc-slider"}, React.createElement("div", {"className": "rc-slider-handle", "style": { left: "100%" }}), React.createElement("div", {"className": "rc-slider-handle", "style": { left: "0%" }}), React.createElement("div", {"className": "rc-slider-track", "style": { left: "0%", width: "100%", visibility: "visible" }}), React.createElement("div", {"className": "rc-slider-step"}), React.createElement("div", {"className": "rc-slider-mark"})), React.createElement("div", {"className": "range-filter__x-label range-filter-value-labels"}, React.createElement("div", {"className": "range-filter-value-labels__min"}, "0"), React.createElement("div", {"className": "range-filter-value-labels__max"}, "100")))));
    });
    it("renders without histogram", function () {
        _this.createWrapper(false);
        expect(_this.wrapper.find(".bar-chart").length).toBe(0);
        expect(_this.wrapper.find(".bar-chart__bar").length).toBe(0);
    });
    it("handle slider events correctly", function () {
        _this.createWrapper(true);
        _this.wrapper.node.sliderUpdate([30, 70]);
        expect(_this.accessor.state.getValue()).toEqual({
            min: 30, max: 70
        });
        expect(_this.searchkit.performSearch).not.toHaveBeenCalled();
        _this.wrapper.node.sliderUpdateAndSearch([40, 60]);
        expect(_this.accessor.state.getValue()).toEqual({
            min: 40, max: 60
        });
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=RangeFilterSpec.js.map