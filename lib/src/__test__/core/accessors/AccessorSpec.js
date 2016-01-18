var _this = this;
var _1 = require("../../../");
describe("Accessor", function () {
    beforeEach(function () {
        _this.searchkit = new _1.SearchkitManager("/", { useHistory: false });
        spyOn(_1.Utils, "guid").and.returnValue("some_uuid");
        _this.accessor = new _1.Accessor();
        _this.query = new _1.ImmutableQuery();
    });
    it("constructor()", function () {
        expect(_this.accessor.active).toBe(true);
        expect(_this.accessor.uuid).toBe("some_uuid");
    });
    it("setActive()", function () {
        expect(_this.accessor.setActive(false).active)
            .toBe(false);
    });
    it("setSearchkitManager()", function () {
        _this.accessor.setSearchkitManager(_this.searchkit);
        expect(_this.accessor.searchkit).toBe(_this.searchkit);
    });
    it("translate()", function () {
        expect(_this.accessor.translate("foo")).toBe("foo");
        _this.searchkit.translate = function (key) { return key + "_translated"; };
        _this.accessor.setSearchkitManager(_this.searchkit);
        expect(_this.accessor.translate("foo")).toBe("foo_translated");
    });
    it("set + get results", function () {
        _this.accessor.setResults("lots of hits");
        expect(_this.accessor.getResults()).toBe("lots of hits");
    });
    it("getAggregations()", function () {
        expect(_this.accessor.getAggregations(["tags", "buckets"], []))
            .toEqual([]);
        _this.accessor.setResults({
            aggregations: {
                tags: {
                    buckets: [1, 2, 3]
                }
            }
        });
        expect(_this.accessor.getAggregations(["tags", "buckets"], []))
            .toEqual([1, 2, 3]);
    });
    it("buildSharedQuery()", function () {
        expect(_this.accessor.buildSharedQuery(_this.query))
            .toBe(_this.query);
    });
    it("buildOwnQuery()", function () {
        expect(_this.accessor.buildOwnQuery(_this.query))
            .toBe(_this.query);
    });
});
//# sourceMappingURL=AccessorSpec.js.map