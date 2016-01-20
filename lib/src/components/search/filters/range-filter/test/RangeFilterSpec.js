var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var RangeFilter_tsx_1 = require("../src/RangeFilter.tsx");
var core_1 = require("../../../../../core");
describe("Reset Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: true });
        _this.createWrapper = function (withHistogram) {
            _this.wrapper = enzyme_1.mount(React.createElement(RangeFilter_tsx_1.RangeFilter, {"id": "m", "searchkit": _this.searchkit, "field": "metascore", "min": 0, "max": 100, "title": "metascore", "showHistogram": withHistogram}));
            _this.searchkit.setResults({
                "aggregations": {
                    "m": {
                        "m": {
                            "buckets": [
                                { key: "10", count: 1 },
                                { key: "20", count: 3 },
                                { key: "30", count: 1 },
                                { key: "40", count: 1 },
                                { key: "50", count: 1 },
                                { key: "60", count: 5 },
                                { key: "70", count: 1 },
                                { key: "80", count: 1 },
                                { key: "90", count: 1 },
                                { key: "100", count: 1 }
                            ]
                        }
                    }
                }
            });
            _this.wrapper.update();
        };
    });
    it('renders correctly', function () {
        _this.createWrapper(true);
        expect(_this.wrapper.find(".range-filter").hasClass("is-disabled")).toBe(false);
        expect(_this.wrapper.find(".range-filter__header").text()).toBe("metascore");
        expect(_this.wrapper.find(".range-filter-value-labels__min").text()).toBe("0");
        expect(_this.wrapper.find(".range-filter-value-labels__max").text()).toBe("100");
        expect(_this.wrapper.find(".bar-chart").length).toBe(1);
        expect(_this.wrapper.find(".bar-chart__bar").length).toBe(10);
    });
    it("renders without histogram", function () {
        _this.createWrapper(false);
        expect(_this.wrapper.find(".bar-chart").length).toBe(0);
        expect(_this.wrapper.find(".bar-chart__bar").length).toBe(0);
    });
});
//# sourceMappingURL=RangeFilterSpec.js.map