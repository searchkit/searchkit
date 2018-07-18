var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var ItemListComponents_1 = require("./ItemListComponents");
var ItemComponents_1 = require("./ItemComponents");
var MockList_1 = require("./MockList");
var TestHelpers_1 = require("../../__test__/TestHelpers");
describe("ItemList Components", function () {
    it("ItemList should render and behave correctly", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockList_1.MockList, { listComponent: ItemListComponents_1.ItemList }));
        expect(_this.wrapper).toMatchSnapshot();
        _this.wrapper.setProps({ disabled: true });
        expect(_this.wrapper.find(".sk-item-list").hasClass("is-disabled")).toBe(true);
        expect(_this.wrapper.find(".sk-item-list-option__count").length).toBe(4);
        _this.wrapper.setProps({ showCount: false });
        expect(_this.wrapper.find(".sk-item-list-option__count").length).toBe(0);
        expect(_this.wrapper.find("input[type='checkbox']").length).toBe(0);
        _this.wrapper.setProps({ itemComponent: ItemComponents_1.CheckboxItemComponent });
        expect(_this.wrapper.find("input[type='checkbox']").length).toBe(4);
        _this.wrapper.setProps({ mod: "my-item-list" });
        expect(_this.wrapper.find(".my-item-list").length).toBe(1);
        expect(_this.wrapper.node.state.toggleItem).not.toHaveBeenCalled();
        TestHelpers_1.fastClick(_this.wrapper.find(".my-item-list-option").at(2));
        expect(_this.wrapper.node.state.toggleItem).toHaveBeenCalledWith("c");
    });
    it("check default props are set correctly", function () {
        expect(ItemListComponents_1.CheckboxItemList.defaultProps.itemComponent).toBe(ItemComponents_1.CheckboxItemComponent);
        expect(ItemListComponents_1.ItemList.defaultProps.itemComponent).toBe(ItemComponents_1.ItemComponent);
    });
    it("mod + classname can be updated", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(MockList_1.MockList, { listComponent: ItemListComponents_1.ItemList, mod: "sk-item-list-updated", className: "my-custom-class" }));
        expect(_this.wrapper.find(".sk-item-list-updated").hasClass("my-custom-class")).toBe(true);
    });
});
//# sourceMappingURL=ItemListComponents.unit.js.map