var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
var _1 = require("../../../");
describe("State", function () {
    beforeEach(function () {
        var ExampleState = (function (_super) {
            __extends(ExampleState, _super);
            function ExampleState() {
                _super.apply(this, arguments);
            }
            return ExampleState;
        })(_1.State);
        _this.state = new ExampleState(1);
    });
    afterEach(function () {
        //test immutability
        expect(_this.state.value).toEqual(1);
    });
    it("getValue()", function () {
        expect(_this.state.getValue()).toEqual(1);
    });
    it("create()", function () {
        expect(_this.state.value).toEqual(1);
        expect(_this.state.create(2).value).toEqual(2);
    });
    it("setValue()", function () {
        expect(_this.state.setValue(2).value).toEqual(2);
    });
    it("hasValue()", function () {
        expect(_this.state.hasValue()).toBe(true);
        var state = _this.state.clear();
        expect(state.hasValue()).toBe(false);
    });
    it("clear()", function () {
        expect(_this.state.clear().value).toEqual(null);
    });
});
//# sourceMappingURL=StateSpec.js.map