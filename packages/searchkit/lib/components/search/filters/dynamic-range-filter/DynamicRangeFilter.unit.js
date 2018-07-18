var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var DynamicRangeFilter_1 = require("./DynamicRangeFilter");
var core_1 = require("../../../../core");
describe("Dynamic Range Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.rangeFormatter = function (count) { return count + " score"; };
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(DynamicRangeFilter_1.DynamicRangeFilter, { id: "m", searchkit: _this.searchkit, field: "metascore", title: "metascore", rangeFormatter: _this.rangeFormatter, translations: { "range.divider": " TO " } }));
            _this.searchkit.setResults({
                "aggregations": {
                    "m": {
                        "m": {
                            avg: 20,
                            count: 1,
                            max: 120,
                            min: 1,
                            sum: 100000
                        }
                    }
                }
            });
            _this.wrapper.update();
            _this.accessor = _this.searchkit.getAccessorByType(core_1.DynamicRangeAccessor);
        };
    });
    it("renders correctly", function () {
        _this.createWrapper();
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("accessor has correct config", function () {
        _this.createWrapper();
        expect(_this.accessor.options).toEqual({
            id: "m",
            field: "metascore",
            title: "metascore",
            fieldOptions: {
                type: "embedded",
                field: "metascore"
            },
            rangeFormatter: _this.rangeFormatter,
            translations: { "range.divider": " TO " }
        });
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
        // min/max should clear
        _this.wrapper.node.sliderUpdateAndSearch({ min: 1, max: 120 });
        expect(_this.accessor.state.getValue()).toEqual({});
    });
});
//# sourceMappingURL=DynamicRangeFilter.unit.js.map