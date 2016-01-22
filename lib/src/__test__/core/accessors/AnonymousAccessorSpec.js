var _1 = require("../../../");
describe("AnonymousAccessor", function () {
    it("should override buildSharedQuery", function () {
        var accessor = new _1.AnonymousAccessor(function (query) {
            return query.setSize(11);
        });
        var query = accessor.buildSharedQuery(new _1.ImmutableQuery());
        expect(query.getSize()).toBe(11);
    });
    it("should handle null fn", function () {
        var accessor = new _1.AnonymousAccessor(null);
        var query = new _1.ImmutableQuery();
        expect(accessor.buildSharedQuery(query)).toBe(query);
    });
});
//# sourceMappingURL=AnonymousAccessorSpec.js.map