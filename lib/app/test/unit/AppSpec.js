var _this = this;
var React = require("react/addons");
var testUtils = React.addons.TestUtils;
var App_1 = require("./../../src/App");
// Check here what's avaiable in TestUtils: https://facebook.github.io/react/docs/test-utils.html
describe("ContentPage tests", function () {
    beforeEach(function () {
        _this.component = testUtils.renderIntoDocument(React.createElement(App_1.App, {"name": "test"}));
    });
    describe("render tests", function () {
        it("renders logo", function () {
            var logoElement = testUtils.findRenderedDOMComponentWithTag(_this.component, "h1");
            expect(logoElement.textContent).toBe("testing fvdf, test!");
        });
    });
});
//# sourceMappingURL=AppSpec.js.map