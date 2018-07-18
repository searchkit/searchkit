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
;
var enzyme_1 = require("enzyme");
var core_1 = require("../../../core");
var _1 = require("../../");
describe("PageSizeSelector", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.setWrapper = function (props) {
            if (props === void 0) { props = {}; }
            _this.wrapper = enzyme_1.mount(React.createElement("div", null,
                React.createElement(_1.PageSizeSelector, __assign({ options: [4, 12, 24], searchkit: _this.searchkit }, props)),
                React.createElement(_1.Hits, { hitsPerPage: 12, searchkit: _this.searchkit })));
            _this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                    total: 2
                }
            });
            _this.accessor = _this.searchkit.getAccessorByType(core_1.PageSizeAccessor);
        };
    });
    it("getSize()", function () {
        _this.setWrapper();
        expect(_this.accessor.getSize()).toBe(12);
        _this.accessor.state = _this.accessor.state.setValue("24");
        expect(_this.accessor.getSize()).toBe(24);
    });
    it("should render and behave correctly", function () {
        _this.setWrapper();
        expect(_this.wrapper).toMatchSnapshot();
        var option24 = _this.wrapper.find("select").children().at(2);
        option24.simulate("change");
        expect(_this.accessor.getSize()).toBe(24);
    });
    it("should set mod, className, custom listComponent", function () {
        _this.setWrapper({
            mod: "my-page-selector", className: "my-class",
            listComponent: _1.Toggle
        });
        expect(_this.wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=PageSizeSelector.unit.js.map