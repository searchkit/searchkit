var _this = this;
var _1 = require("../../../../../");
describe("BoolQueries", function () {
    beforeEach(function () {
        _this.testBool = function (boolFn, operator) {
            expect(boolFn([])).toEqual({});
            expect(boolFn(["filter"])).toEqual("filter");
            expect(boolFn(["filter1", "filter2"])).toEqual({
                bool: (_a = {}, _a[operator] = ["filter1", "filter2"], _a)
            });
            var _a;
        };
    });
    it("BoolMust", function () {
        _this.testBool(_1.BoolMust, "must");
    });
    it("BoolShould", function () {
        _this.testBool(_1.BoolShould, "should");
    });
    it("BoolMustNot", function () {
        _this.testBool(_1.BoolMustNot, "must_not");
    });
});
//# sourceMappingURL=BoolQueriesSpec.js.map