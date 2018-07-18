var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var RangeInput_1 = require("./RangeInput");
var MockRange_1 = require("./MockRange");
describe("RangeInput", function () {
    it("should render and behave correctly", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockRange_1.MockRange, { rangeComponent: RangeInput_1.RangeInput }));
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("mod + classname can be updated", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockRange_1.MockRange, { rangeComponent: RangeInput_1.RangeInput, mod: "sk-range-slider-updated", className: "my-custom-class" }));
        expect(_this.wrapper.find(".sk-range-slider-updated").hasClass("my-custom-class")).toBe(true);
    });
});
//# sourceMappingURL=RangeInput.unit.js.map