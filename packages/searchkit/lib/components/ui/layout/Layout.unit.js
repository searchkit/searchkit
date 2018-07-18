var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var Layout_1 = require("./Layout");
describe("Layout components", function () {
    it("should render correctly", function () {
        _this.wrapper = enzyme_1.mount(React.createElement("div", null,
            React.createElement(Layout_1.Layout, { size: "m" },
                React.createElement(Layout_1.TopBar, null, "search bar"),
                React.createElement(Layout_1.LayoutBody, null,
                    React.createElement(Layout_1.SideBar, null, "filters"),
                    React.createElement(Layout_1.LayoutResults, null,
                        React.createElement(Layout_1.ActionBar, null,
                            React.createElement(Layout_1.ActionBarRow, null, "row 1"),
                            React.createElement(Layout_1.ActionBarRow, null, "row 2")),
                        React.createElement("p", null, "hits"))))));
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("layout - no size prop", function () {
        _this.wrapper = enzyme_1.mount(React.createElement("div", null,
            React.createElement(Layout_1.Layout, null, "content")));
        expect(_this.wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=Layout.unit.js.map