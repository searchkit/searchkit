var _this = this;
var _1 = require("../../../../../");
describe("BucketAggregations", function () {
    beforeEach(function () {
        _this.childBucket = _1.AggsContainer("child", { name: "child" });
        _this.log = function (ob) { return console.log(JSON.stringify(ob, null, 2)); };
        _this.aggsKey = "aggsKey";
        _this.expectAggs = function (ob) {
            expect(_this.aggs).toEqual({
                "aggsKey": _.extend(ob, { aggs: _this.childBucket })
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
        _this.aggs = _1.SignificantTermsBucket(_this.aggsKey, "crime_type", _this.childBucket);
        _this.expectAggs({
            significant_terms: { field: "crime_type" } });
    });
});
//# sourceMappingURL=BucketAggregationsSpec.js.map