var _this = this;
var React = require("react");
var _1 = require("../../../");
var enzyme_1 = require("enzyme");
describe("SearchkitProvider", function () {
    beforeEach(function () {
        _this.searchkit = _1.SearchkitManager.mock();
        _this.wrapper = enzyme_1.mount(React.createElement(_1.LoadingComponent, {"searchkit": _this.searchkit}, React.createElement("p", null, "loading...")));
    });
    it("display nothing when not loading", function () {
        expect(_this.wrapper.html()).toBe("<div></div>");
    });
    it("display children when loading", function () {
        _this.searchkit.loading = true;
        _this.wrapper.update();
        expect(_this.wrapper.html()).toBe("<p>loading...</p>");
    });
});
//# sourceMappingURL=LoadingComponentSpec.js.map