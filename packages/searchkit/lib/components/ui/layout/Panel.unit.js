var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var Panel_1 = require("./Panel");
describe("Panel", function () {
    beforeEach(function () {
        _this.wrapper = enzyme_1.mount(React.createElement(Panel_1.Panel, { title: "My Panel" },
            React.createElement("p", null, "panel content...")));
    });
    it("should render correctly", function () {
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("should be collapsable", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(Panel_1.Panel, { title: "My Panel", collapsable: true },
            React.createElement("p", null, "panel content...")));
        expect(_this.wrapper).toMatchSnapshot();
        var expectIsCollapsed = function (shouldBeCollapsed) {
            expect(_this.wrapper.find(".sk-panel__content").hasClass("is-collapsed"))
                .toBe(shouldBeCollapsed);
            expect(_this.wrapper.find(".sk-panel__header").hasClass("is-collapsed"))
                .toBe(shouldBeCollapsed);
        };
        //test collapsing
        expectIsCollapsed(true);
        _this.wrapper.find(".sk-panel__header").simulate("click");
        expectIsCollapsed(false);
        _this.wrapper.find(".sk-panel__header").simulate("click");
        expectIsCollapsed(true);
        _this.wrapper.setProps({ defaultCollapsed: false });
        expectIsCollapsed(false);
    });
    it("can be disabled", function () {
        expect(_this.wrapper.find(".sk-panel").hasClass("is-disabled")).toBe(false);
        _this.wrapper.setProps({ disabled: true });
        expect(_this.wrapper.find(".sk-panel").hasClass("is-disabled")).toBe(true);
    });
    it("mod + classname can be updated", function () {
        _this.wrapper.setProps({ mod: "sk-panel-updated", className: "my-custom-class" });
        expect(_this.wrapper.find(".sk-panel-updated").hasClass("my-custom-class")).toBe(true);
    });
    it("defaultCollapsed", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(Panel_1.Panel, { title: "My Panel", collapsable: true, defaultCollapsed: false },
            React.createElement("p", null, "panel content...")));
        expect(_this.wrapper.find(".sk-panel__header").hasClass("is-collapsable"))
            .toBe(true);
        expect(_this.wrapper.find(".sk-panel__header").hasClass("is-collapsed"))
            .toBe(false);
    });
});
//# sourceMappingURL=Panel.unit.js.map