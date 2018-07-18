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
var ItemComponents_1 = require("./ItemComponents");
var _1 = require("../../../");
var TestHelpers_1 = require("../../__test__/TestHelpers");
describe("ItemComponents", function () {
    beforeEach(function () {
        _this.bemBlocks = {
            container: _1.block("sk-item-container").el,
            option: _1.block("sk-item-option").el
        };
        _this.onClick = jasmine.createSpy("toggleItem");
        _this.props = {
            label: "Images", count: 10, itemKey: "images",
            onClick: _this.onClick,
            bemBlocks: _this.bemBlocks, showCount: true
        };
    });
    it("should render and behave correctly", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(ItemComponents_1.ItemComponent, __assign({}, _this.props)));
        expect(_this.wrapper).toMatchSnapshot();
        _this.wrapper.setProps({ showCount: false, showCheckbox: true });
        expect(_this.wrapper).toMatchSnapshot();
        _this.wrapper.setProps({ showCount: true, showCheckbox: false, count: undefined });
        expect(_this.wrapper).toMatchSnapshot();
        _this.wrapper.setProps({ active: true });
        expect(_this.wrapper.find(".sk-item-option").hasClass("is-active")).toBe(true);
        expect(_this.onClick).not.toHaveBeenCalled();
        TestHelpers_1.fastClick(_this.wrapper.find(".sk-item-option"));
        expect(_this.onClick).toHaveBeenCalled();
    });
    it("test default props for subclassed components", function () {
        expect(ItemComponents_1.CheckboxItemComponent.defaultProps.showCheckbox).toBe(true);
        expect(ItemComponents_1.ItemComponent.defaultProps.showCheckbox).toBe(false);
    });
});
//# sourceMappingURL=ItemComponents.unit.js.map