var _this = this;
var _1 = require("../../../");
describe("SortingAccessor", function () {
    beforeEach(function () {
        _this.options = {
            options: [
                {
                    label: "Highest Price",
                    field: 'price',
                    order: 'desc'
                },
                {
                    label: "Lowest Price",
                    field: 'price',
                    order: 'asc'
                }
            ]
        };
        _this.accessor = new _1.SortingAccessor("sort", _this.options);
    });
    it("constructor()", function () {
        expect(_this.accessor.key).toBe("sort");
        expect(_this.accessor.options).toBe(_this.options);
    });
    it("buildOwnQuery()", function () {
        _this.accessor.state = new _1.ValueState("Lowest Price");
        var query = new _1.ImmutableQuery();
        var priceQuery = _this.accessor.buildOwnQuery(query);
        expect(priceQuery.query.sort).toEqual([{
                price: 'asc'
            }]);
        _this.accessor.state = _this.accessor.state.clear();
        var emptyQuery = _this.accessor.buildOwnQuery(query);
        expect(emptyQuery.query.sort).toBe(undefined);
        expect(emptyQuery).toBe(query);
    });
});
//# sourceMappingURL=SortingAccessorSpec.js.map