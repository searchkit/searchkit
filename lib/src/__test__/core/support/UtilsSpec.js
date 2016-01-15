var _1 = require("../../../");
describe("Utils", function () {
    it("guid()", function () {
        expect(_1.Utils.guid().length).toEqual(36);
    });
    it("collapse()", function () {
        var times2 = function (n) { return n * 2; };
        expect(_1.Utils.collapse([times2, times2, times2], 1)).toBe(8);
    });
    it("instanceOf", function () {
        var isRegex = _1.Utils.instanceOf(RegExp);
        expect(isRegex(/s/)).toBe(true);
        expect(isRegex("s")).toBe(false);
    });
});
//# sourceMappingURL=UtilsSpec.js.map