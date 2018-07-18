var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var RangeFilter_1 = require("../src/RangeFilter");
var components_1 = require("../../../../../components");
var core_1 = require("../../../../../core");
describe("Range Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.rangeFormatter = function (count) { return count + " score"; };
        _this.createWrapper = function (_a) {
            var _b = _a.withHistogram, withHistogram = _b === void 0 ? true : _b, _c = _a.interval, interval = _c === void 0 ? undefined : _c, _d = _a.rangeComponent, rangeComponent = _d === void 0 ? components_1.RangeSliderHistogram : _d;
            _this.wrapper = enzyme_1.mount(React.createElement(RangeFilter_1.RangeFilter, { id: "m", searchkit: _this.searchkit, field: "metascore", min: 0, max: 100, title: "metascore", interval: interval, translations: { "range.divider": " to " }, rangeFormatter: _this.rangeFormatter, rangeComponent: rangeComponent, showHistogram: withHistogram }));
            _this.searchkit.setResults({
                "aggregations": {
                    "m1": {
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
                            ],
                            "value": 10
                        }
                    }
                }
            });
            _this.wrapper.update();
            _this.accessor = _this.searchkit.getAccessorByType(core_1.RangeAccessor);
        };
    });
    it("accessor has correct config", function () {
        _this.createWrapper({ withHistogram: true });
        expect(_this.accessor.options).toEqual({
            id: "m",
            min: 0,
            max: 100,
            field: "metascore",
            title: "metascore",
            interval: undefined,
            loadHistogram: true,
            fieldOptions: {
                type: 'embedded',
                field: 'metascore'
            },
            rangeFormatter: _this.rangeFormatter,
            translations: { "range.divider": " to " }
        });
    });
    it('renders correctly', function () {
        _this.createWrapper({ withHistogram: true });
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("renders without histogram", function () {
        _this.createWrapper({ withHistogram: false });
        expect(_this.wrapper.find(".sk-range-histogram").length).toBe(0);
        expect(_this.wrapper.find(".sk-range-histogram__bar").length).toBe(0);
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("handle slider events correctly", function () {
        _this.createWrapper(true);
        _this.wrapper.node.sliderUpdate({ min: 30, max: 70 });
        expect(_this.accessor.state.getValue()).toEqual({
            min: 30, max: 70
        });
        expect(_this.searchkit.performSearch).not.toHaveBeenCalled();
        _this.wrapper.node.sliderUpdateAndSearch({ min: 40, max: 60 });
        expect(_this.accessor.state.getValue()).toEqual({
            min: 40, max: 60
        });
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
        var query = _this.searchkit.buildQuery();
        expect(query.getSelectedFilters()[0].value).toEqual('40 score to 60 score');
        expect(_this.wrapper).toMatchSnapshot();
        // min/max should clear
        _this.wrapper.node.sliderUpdateAndSearch({ min: 0, max: 100 });
        expect(_this.accessor.state.getValue()).toEqual({});
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("has default interval", function () {
        _this.createWrapper({ withHistogram: true });
        expect(_this.accessor.getInterval()).toEqual(5);
    });
    it("handles interval correctly", function () {
        _this.createWrapper({ withHistogram: true, interval: 2 });
        expect(_this.accessor.getInterval()).toEqual(2);
    });
    it("renders limited range correctly", function () {
        _this.createWrapper({ withHistogram: true });
        _this.wrapper.node.sliderUpdate({ min: 30, max: 70 });
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("renders with range input component", function () {
        _this.createWrapper({ withHistogram: false, rangeComponent: components_1.RangeInput });
        expect(_this.wrapper).toMatchSnapshot();
        _this.wrapper.find("input[placeholder='min']")
            .simulate('change', { target: { value: 20 } });
        _this.wrapper.find("input[placeholder='max']")
            .simulate('change', { target: { value: 80 } });
        _this.wrapper.find("form").simulate('submit');
        var query = _this.searchkit.buildQuery();
        expect(query.getSelectedFilters()[0].value)
            .toEqual("20 score to 80 score");
    });
});
//# sourceMappingURL=RangeFilterSpec.js.map