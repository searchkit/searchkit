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
    it("interpolate", function () {
        expect(_1.Utils.interpolate("hello {message}, Hello {message}{ending}{missing}", {
            message: "World",
            ending: "!"
        })).toEqual("hello World, Hello World!{missing}");
    });
    it("translate() - don't call interpolate", function () {
        var key = "No Results found!";
        spyOn(_1.Utils, "interpolate");
        expect(_1.Utils.translate(key)).toBe(key);
        expect(_1.Utils.interpolate).not.toHaveBeenCalled();
    });
    it("translate() - with interpolations", function () {
        var key = "{count} Results found!";
        spyOn(_1.Utils, "interpolate").and.callThrough();
        expect(_1.Utils.translate(key, { count: 5 })).toBe("5 Results found!");
        expect(_1.Utils.interpolate).toHaveBeenCalledWith(key, { count: 5 });
    });
});
//# sourceMappingURL=UtilsSpec.js.map