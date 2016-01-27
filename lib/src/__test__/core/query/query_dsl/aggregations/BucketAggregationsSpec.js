var _this = this;
var _1 = require("../../../../../");
var _ = require("lodash");
describe("BucketAggregations", function () {
    beforeEach(function () {
        _this.childBucket = _1.AggsContainer("child", { name: "child" });
        _this.log = function (ob) { return console.log(JSON.stringify(ob, null, 2)); };
        _this.aggsKey = "aggsKey";
        _this.expectAggs = function (ob) {
            expect(_this.aggs).toEqual({
                "aggsKey": _.assign(ob, { aggs: _this.childBucket })
            });
        };
    });
    it("TermsBucket", function () {
        _this.aggs = _1.TermsBucket(_this.aggsKey, "genres", { size: 10 }, _this.childBucket);
        _this.expectAggs({ terms: { field: "genres", size: 10 } });
    });
    it("RangeBucket", function () {
        _this.aggs = _1.RangeBucket(_this.aggsKey, "prices", [1, 2, 3], _this.childBucket);
        _this.expectAggs({
            range: {
                field: "prices", ranges: [1, 2, 3]
            }
        });
    });
    it("ChildrenBucket", function () {
        _this.aggs = _1.ChildrenBucket(_this.aggsKey, "tags", _this.childBucket);
        _this.expectAggs({ children: { type: "tags" } });
    });
    it("FilterBucket", function () {
        _this.aggs = _1.FilterBucket(_this.aggsKey, "somefilter", _this.childBucket);
        _this.expectAggs({ filter: "somefilter" });
    });
    it("NestedBucket", function () {
        _this.aggs = _1.NestedBucket(_this.aggsKey, "tags", _this.childBucket);
        _this.expectAggs({ nested: { path: "tags" } });
    });
    it("SignificantTermsBucket", function () {
        expect(_1.SignificantTermsBucket(_this.aggsKey, "crime_type")).toEqual((_a = {},
            _a[_this.aggsKey] = {
                significant_terms: { field: "crime_type" }
            },
            _a
        ));
        _this.aggs = _1.SignificantTermsBucket(_this.aggsKey, "crime_type", { size: 10 }, _this.childBucket);
        _this.expectAggs({
            significant_terms: { field: "crime_type", size: 10 } });
        var _a;
    });
    it("GeohashBucket", function () {
        _this.aggs = _1.GeohashBucket(_this.aggsKey, "location", { precision: 5 }, _this.childBucket);
        _this.expectAggs({ geohash_grid: { field: "location", precision: 5 } });
    });
    it("HistogramBucket", function () {
        expect(_1.HistogramBucket(_this.aggsKey, "price")).toEqual((_a = {},
            _a[_this.aggsKey] = {
                histogram: { field: "price" }
            },
            _a
        ));
        _this.aggs = _1.HistogramBucket(_this.aggsKey, "price", { interval: 1 }, _this.childBucket);
        _this.expectAggs({ histogram: { field: "price", interval: 1 } });
        var _a;
    });
});
//# sourceMappingURL=BucketAggregationsSpec.js.map