var _this = this;
var _1 = require("../../../");
describe("PaginationAccessor", function () {
    beforeEach(function () {
        _this.accessor = new _1.PaginationAccessor("p");
    });
    it("onStateChange", function () {
        _this.accessor.state = _this.accessor.state.setValue(2);
        _this.accessor.onStateChange({ p: 1 });
        expect(_this.accessor.state.getValue()).toBe(2);
        //when old page number is same as current
        //we should clear the page number
        _this.accessor.onStateChange({ p: 2 });
        expect(_this.accessor.state.getValue()).toBe(null);
    });
    it("buildOwnQuery", function () {
        var query = new _1.ImmutableQuery().setSize(20);
        var expectStateFrom = function (state, from) {
            _this.accessor.state = _this.accessor.state.setValue(state);
            query = _this.accessor.buildOwnQuery(query);
            expect(query.getFrom()).toBe(from);
        };
        expectStateFrom(null, undefined);
        expectStateFrom(1, undefined);
        expectStateFrom(2, 20);
        expectStateFrom(3, 40);
        query = query.setSize(15);
        expectStateFrom(3, 30);
    });
});
//# sourceMappingURL=PaginationAccessorSpec.js.map