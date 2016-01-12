var _this = this;
var _1 = require("../../../");
describe("NumericOptionsAccessor", function () {
    beforeEach(function () {
        _this.searcher = new _1.Searcher(null);
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
        _this.accessor.setSearcher(_this.searcher);
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
        _this.searcher.results = {
            aggregations: {
                categories: {
                    categories: {
                        buckets: [1, 2, 3, 4]
                    }
                }
            }
        };
        expect(_this.accessor.getBuckets())
            .toEqual([1, 2, 3, 4]);
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
        var filters = query.query.filter.$array[0].$array;
        expect(_this.toPlainObject(filters)).toEqual([{
                "range": {
                    "price": {
                        "gte": 11,
                        "lt": 21
                    }
                },
                "$disabled": false,
                "$name": "”Price",
                "$value": "Affordable",
                "$id": "price_id"
            }]);
        filters[0].$remove();
        expect(_this.accessor.state.getValue()).toEqual(null);
        //test empty state yields same query
        var newQuery = _this.accessor.buildSharedQuery(query);
        expect(newQuery).toBe(query);
    });
    it("buildOwnQuery()", function () {
        var query = _this.accessor.buildOwnQuery(_this.query);
        expect(query.getJSON().aggs).toEqual({
            "categories": {
                "filter": {
                    "bool": {
                        "must": []
                    }
                },
                "aggs": {
                    "categories": {
                        "range": {
                            "field": "price",
                            "ranges": [
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
                            ]
                        }
                    }
                }
            }
        });
    });
});
//# sourceMappingURL=NumericalOptionsAccessorSpec.js.map