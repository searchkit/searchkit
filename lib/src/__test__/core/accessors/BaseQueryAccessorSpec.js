var _this = this;
var _1 = require("../../../");
describe("BaseQueryAccessor", function () {
    beforeEach(function () {
        _this.searchkit = new _1.SearchkitManager("/", { useHistory: false });
        _this.accessor = new _1.BaseQueryAccessor("q");
        _this.accessor.setSearchkitManager(_this.searchkit);
    });
    it("constructor()", function () {
        expect(_this.accessor.key).toBe("q");
        expect(_this.accessor.state.getValue())
            .toBe(null);
    });
    it("keepOnlyQueryState()", function () {
        _this.accessor.state = new _1.ValueState("foo");
        spyOn(_this.accessor, "setQueryString");
        _this.accessor.keepOnlyQueryState();
        expect(_this.accessor.setQueryString)
            .toHaveBeenCalledWith("foo", true);
    });
    it("setQueryString()", function () {
        spyOn(_this.searchkit, "resetState");
        _this.accessor.setQueryString("bar");
        expect(_this.searchkit.resetState)
            .not.toHaveBeenCalled();
        expect(_this.accessor.state.getValue()).toBe('bar');
        _this.accessor.setQueryString("barreset", true);
        expect(_this.searchkit.resetState)
            .toHaveBeenCalled();
        expect(_this.accessor.state.getValue()).toBe('barreset');
    });
    it("getQueryString()", function () {
        _this.accessor.state = new _1.ValueState("hi");
        expect(_this.accessor.getQueryString()).toBe("hi");
    });
});
//# sourceMappingURL=BaseQueryAccessorSpec.js.map