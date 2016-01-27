var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
var React = require("react");
var _1 = require("../../../");
var enzyme_1 = require("enzyme");
describe("SearchkitProvider", function () {
    beforeEach(function () {
        _this.searchkit = _1.SearchkitManager.mock();
        var SomeComponent = (function (_super) {
            __extends(SomeComponent, _super);
            function SomeComponent() {
                _super.apply(this, arguments);
            }
            SomeComponent.prototype.render = function () {
                return React.createElement("h1", null, "Hello");
            };
            return SomeComponent;
        })(_1.SearchkitComponent);
        _this.wrapper = enzyme_1.mount(React.createElement(_1.SearchkitProvider, {"searchkit": _this.searchkit}, React.createElement(SomeComponent, null)));
    });
    it("searchkit provider should work correctly", function () {
        expect(_this.wrapper.html()).toBe("<h1>Hello</h1>");
        expect(_this.wrapper.node.props.searchkit)
            .toBe(_this.searchkit);
    });
});
//# sourceMappingURL=SearchkitProviderSpec.js.map