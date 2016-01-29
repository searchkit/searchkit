var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var core_1 = require("../../../../core");
var TestHelpers_1 = require("../../../__test__/TestHelpers");
var InitialLoader_1 = require("../src/InitialLoader");
describe("InitialLoader", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.wrapper = enzyme_1.mount(React.createElement(InitialLoader_1.InitialLoader, {"searchkit": _this.searchkit}));
    });
    it("should render correctly", function () {
        expect(_this.wrapper.html()).toEqual(TestHelpers_1.jsxToHTML(React.createElement("div", {"data-qa": "initial-loading", "className": "initial-loader__initial-loading"})));
        _this.searchkit.initialLoading = false;
        _this.wrapper.update();
        expect(_this.wrapper.children().length).toBe(0);
    });
    it("should render a custom component", function () {
        var higherOrderComp = function (_a) {
            var bemBlocks = _a.bemBlocks;
            return (React.createElement("p", {"className": bemBlocks.container("foo")}, "Loading"));
        };
        var wrapper = enzyme_1.mount(React.createElement(InitialLoader_1.InitialLoader, {"searchkit": _this.searchkit, "component": higherOrderComp}));
        expect(wrapper.html()).toEqual(TestHelpers_1.jsxToHTML(React.createElement("p", {"className": "initial-loader__foo"}, "Loading")));
    });
});
//# sourceMappingURL=InitialLoaderSpec.js.map