var _this = this;
var _1 = require("../../../");
describe("", function () {
    beforeEach(function () {
        _this.accessor = new _1.HighlightAccessor([
            "title", "content"
        ]);
    });
    it("constructor(), computeHighlightedFields()", function () {
        expect(_this.accessor.highlightFields).toEqual({
            fields: {
                title: {},
                content: {}
            }
        });
    });
    it("buildOwnQuery()", function () {
        var query = _this.accessor.buildOwnQuery(new _1.ImmutableQuery());
        expect(query.query.highlight).toEqual({
            fields: {
                title: {},
                content: {}
            }
        });
    });
});
//# sourceMappingURL=HighlightAccessorSpec.js.map