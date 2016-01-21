var _this = this;
var _1 = require("../../../");
describe("BaseQueryAccessor", function () {
    beforeEach(function () {
        _this.searchkit = _1.SearchkitManager.mock();
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
    it("noopQueryAccessor", function () {
        spyOn(console, "warn");
        _1.noopQueryAccessor.keepOnlyQueryState();
        _1.noopQueryAccessor.setQueryString("foo");
        expect(_1.noopQueryAccessor.getQueryString()).toBe("");
        expect(console.warn).toHaveBeenCalledWith("keepOnlyQueryState called, No Query Accessor exists");
        expect(console.warn).toHaveBeenCalledWith("setQueryString called, No Query Accessor exists");
        expect(console.warn).toHaveBeenCalledWith("getQueryString called, No Query Accessor exists");
    });
});
//# sourceMappingURL=BaseQueryAccessorSpec.js.map