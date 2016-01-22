var _this = this;
var _1 = require("../../../");
require("jasmine-ajax");
describe("MockESTransport", function () {
    beforeEach(function () {
        _this.transport = new _1.MockESTransport();
    });
    it("contructed correctly", function () {
        expect(_this.transport).toEqual(jasmine.any(_1.ESTransport));
    });
    it("search()", function (done) {
        _this.transport.search("query").then(function (returnValue) {
            expect(returnValue).toEqual("query");
            done();
        });
    });
});
//# sourceMappingURL=MockESTransportSpec.js.map