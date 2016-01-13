var _this = this;
var _1 = require("../../../");
describe("PageSizeAccessor", function () {
    beforeEach(function () {
        _this.accessor = new _1.PageSizeAccessor(10);
        _this.query = new _1.ImmutableQuery();
    });
    it("constructor()", function () {
        expect(_this.accessor.size).toBe(10);
    });
    it("buildSharedQuery()", function () {
        var query = _this.accessor.buildSharedQuery(_this.query);
        expect(query).not.toBe(_this.query);
        expect(query.getSize()).toBe(10);
    });
});
//# sourceMappingURL=PageSizeAccessorSpec.js.map