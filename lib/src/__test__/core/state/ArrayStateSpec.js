var _this = this;
var _1 = require("../../../");
describe("ArrayState", function () {
    beforeEach(function () {
        _this.state = new _1.ArrayState([1, 2, 3]);
    });
    afterEach(function () {
        //test immutability
        expect(_this.state.value).toEqual([1, 2, 3]);
    });
    it("getValue()", function () {
        expect(_this.state.getValue()).toEqual([1, 2, 3]);
        expect(_this.state.create(null).getValue()).toEqual([]);
    });
    it("toggle()", function () {
        expect(_this.state.toggle(1).getValue())
            .toEqual([2, 3]);
        expect(_this.state.toggle(4).getValue())
            .toEqual([1, 2, 3, 4]);
    });
    it("clear()", function () {
        expect(_this.state.clear().getValue()).toEqual([]);
    });
    it("remove()", function () {
        expect(_this.state.remove(2).getValue()).toEqual([1, 3]);
    });
    it("add()", function () {
        expect(_this.state.add(0).getValue()).toEqual([1, 2, 3, 0]);
    });
    it("contains()", function () {
        expect(_this.state.contains(2)).toEqual(true);
        expect(_this.state.contains(3)).toEqual(true);
        expect(_this.state.contains(4)).toEqual(false);
    });
});
//# sourceMappingURL=ArrayStateSpec.js.map