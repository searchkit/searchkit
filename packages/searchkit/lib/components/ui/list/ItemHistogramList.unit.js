var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var ItemHistogramList_1 = require("./ItemHistogramList");
var MockList_1 = require("./MockList");
var TestHelpers_1 = require("../../__test__/TestHelpers");
describe("ItemHistogramList Components", function () {
    it("should render and behave correctly", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockList_1.MockList, { listComponent: ItemHistogramList_1.ItemHistogramList }));
        expect(_this.wrapper).toMatchSnapshot();
        _this.wrapper.setProps({ disabled: true });
        expect(_this.wrapper.find(".sk-item-list").hasClass("is-disabled")).toBe(true);
        expect(_this.wrapper.find(".sk-item-list-option__count").length).toBe(4);
        _this.wrapper.setProps({ showCount: false });
        expect(_this.wrapper.find(".sk-item-list-option__count").length).toBe(0);
        _this.wrapper.setProps({ mod: "my-item-list" });
        expect(_this.wrapper.find(".my-item-list").length).toBe(1);
        expect(_this.wrapper.node.state.toggleItem).not.toHaveBeenCalled();
        TestHelpers_1.fastClick(_this.wrapper.find(".my-item-list-option").at(2));
        expect(_this.wrapper.node.state.toggleItem).toHaveBeenCalledWith("c");
    });
    it("should handle multiselect={false}", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockList_1.MockList, { listComponent: ItemHistogramList_1.ItemHistogramList, multiselect: false }));
        expect(_this.wrapper.node.state.toggleItem).not.toHaveBeenCalled();
        expect(_this.wrapper.node.state.setItems).not.toHaveBeenCalled();
        TestHelpers_1.fastClick(_this.wrapper.find(".sk-item-list-option").at(2));
        expect(_this.wrapper.node.state.toggleItem).not.toHaveBeenCalled();
        expect(_this.wrapper.node.state.setItems).toHaveBeenCalledWith(["c"]);
    });
    it("mod + classname can be updated", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockList_1.MockList, { listComponent: ItemHistogramList_1.ItemHistogramList, mod: "sk-item-list-updated", className: "my-custom-class" }));
        expect(_this.wrapper.find(".sk-item-list-updated").hasClass("my-custom-class")).toBe(true);
    });
});
//# sourceMappingURL=ItemHistogramList.unit.js.map