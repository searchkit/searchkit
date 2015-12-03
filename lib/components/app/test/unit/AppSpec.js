var _this = this;
var React = require("react/addons");
var testUtils = React.addons.TestUtils;
var App_tsx_1 = require("./../../src/App.tsx");
// Check here what's avaiable in TestUtils: https://facebook.github.io/react/docs/test-utils.html
describe("ContentPage tests", function () {
    beforeEach(function () {
        _this.component = testUtils.renderIntoDocument(React.createElement(App_tsx_1.default, {"name": "test"}));
    });
    describe("render tests", function () {
        it("renders logo", function () {
            var logoElement = testUtils.findRenderedDOMComponentWithTag(_this.component, "h1");
            expect(logoElement.textContent).toBe("testing fvdf, test!");
        });
    });
});
//# sourceMappingURL=AppSpec.js.map