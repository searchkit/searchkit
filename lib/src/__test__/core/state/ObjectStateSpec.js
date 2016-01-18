var _this = this;
var _1 = require("../../../");
describe("ObjectState", function () {
    beforeEach(function () {
        _this.state = new _1.ObjectState({ a: "b" });
    });
    afterEach(function () {
        //test immutability
        expect(_this.state.value).toEqual({ a: "b" });
    });
    it("value state", function () {
        expect(_this.state.getValue()).toEqual({ a: "b" });
        expect(_this.state.clear().getValue()).toEqual({});
    });
    it("hasValue()", function () {
        expect(_this.state.hasValue()).toBe(true);
        var state = _this.state.clear();
        expect(state.hasValue()).toBe(false);
    });
});
//# sourceMappingURL=ObjectStateSpec.js.map