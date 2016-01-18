var _this = this;
var _1 = require("../../../");
describe("ValueState", function () {
    beforeEach(function () {
        _this.state = new _1.ValueState("foo");
    });
    afterEach(function () {
        //test immutability
        expect(_this.state.value).toEqual("foo");
    });
    it("value state", function () {
        expect(_this.state.getValue()).toEqual("foo");
        expect(_this.state.create("bar").value).toEqual("bar");
        expect(_this.state.setValue("bar").value).toEqual("bar");
        expect(_this.state.clear().value).toEqual(null);
    });
    it("toggle()", function () {
        var state = _this.state.toggle("bar");
        expect(state.getValue()).toBe("bar");
        state = state.toggle("bar");
        expect(state.getValue()).toBe(null);
    });
});
//# sourceMappingURL=ValueStateSpec.js.map