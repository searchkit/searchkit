var _this = this;
var _1 = require("../../../");
var _ = require("lodash");
describe("NumericOptionsAccessor", function () {
    beforeEach(function () {
        _this.options = {
            field: "price",
            id: "price_id",
            title: "”Price",
            options: [
                { title: "Cheap", from: 1, to: 11 },
                { title: "Affordable", from: 11, to: 21 },
                { title: "Pricey", from: 21, to: 101 }
            ]
        };
        _this.accessor = new _1.NumericOptionsAccessor("categories", _this.options);
        _this.accessor.uuid = "9999";
        _this.query = new _1.ImmutableQuery();
        _this.toPlainObject = function (ob) {
            return JSON.parse(JSON.stringify(ob));
        };
    });
    it("constructor()", function () {
        expect(_this.accessor.key).toBe("categories");
        expect(_this.accessor.options).toBe(_this.options);
    });
    it("getBuckets()", function () {
        _this.accessor.results = {
            aggregations: {
                categories: {
                    categories: {
                        buckets: [
                            { key: 1, doc_count: 1 },
                            { key: 2, doc_count: 2 },
                            { key: 3, doc_count: 3 },
                            { key: 4, doc_count: 0 }
                        ]
                    }
                }
            }
        };
        expect(_.map(_this.accessor.getBuckets(), "key"))
            .toEqual([1, 2, 3]);
    });
    it("getRanges()", function () {
        expect(_this.accessor.getRanges()).toEqual([
            { key: 'Cheap', from: 1, to: 11 },
            { key: 'Affordable', from: 11, to: 21 },
            { key: 'Pricey', from: 21, to: 101 }
        ]);
    });
    it("buildSharedQuery()", function () {
        _this.accessor.state = new _1.ValueState("Affordable");
        var query = _this.accessor.buildSharedQuery(_this.query);
        var expected = _1.BoolMust([
            _1.BoolMust([
                _1.RangeQuery("price", { gte: 11, lt: 21 })
            ])
        ]);
        expect(query.query.filter).toEqual(expected);
        expect(_.keys(query.index.filtersMap))
            .toEqual(["9999"]);
        var selectedFilters = query.getSelectedFilters();
        expect(selectedFilters.length).toEqual(1);
        expect(_this.toPlainObject(selectedFilters[0])).toEqual({
            name: '”Price', value: 'Affordable', id: 'price_id',
        });
        expect(_this.accessor.state.getValue()).toEqual("Affordable");
        selectedFilters[0].remove();
        expect(_this.accessor.state.getValue()).toEqual(null);
    });
    it("buildOwnQuery()", function () {
        _this.query = _this.query.addFilter("other", _1.BoolShould(["foo"]));
        var query = _this.accessor.buildSharedQuery(_this.query);
        query = _this.accessor.buildOwnQuery(query);
        expect(query.query.aggs).toEqual(_1.FilterBucket("categories", _1.BoolMust([_1.BoolShould(["foo"])]), _1.RangeBucket("categories", "price", [
            {
                "key": "Cheap",
                "from": 1,
                "to": 11
            },
            {
                "key": "Affordable",
                "from": 11,
                "to": 21
            },
            {
                "key": "Pricey",
                "from": 21,
                "to": 101
            }
        ])));
    });
});
//# sourceMappingURL=NumericalOptionsAccessorSpec.js.map