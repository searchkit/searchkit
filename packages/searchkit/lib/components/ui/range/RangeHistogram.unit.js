var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var RangeHistogram_1 = require("./RangeHistogram");
var MockRange_1 = require("./MockRange");
describe("RangeHistogram", function () {
    it("should render and behave correctly", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockRange_1.MockRange, { rangeComponent: RangeHistogram_1.RangeHistogram }));
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("mod + classname can be updated", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockRange_1.MockRange, { rangeComponent: RangeHistogram_1.RangeHistogram, mod: "sk-range-histogram-updated", className: "my-custom-class" }));
        expect(_this.wrapper.find(".sk-range-histogram-updated").hasClass("my-custom-class")).toBe(true);
    });
});
//# sourceMappingURL=RangeHistogram.unit.js.map